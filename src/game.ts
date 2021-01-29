import { log } from "fp-ts/Console";
import * as E from "fp-ts/Either";
import { constant, flow, pipe } from "fp-ts/function";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";
import { join, split } from "fp-ts-extras/lib/String";
import { createInterface } from "readline";

import type { Board, Square } from "./board";
import {
  Column,
  defaultBoard,
  isColumn,
  isRow,
  pieceFromSquare,
  Row,
} from "./board";
import type { Move } from "./move";
import { applyMove } from "./move";

// read from standard input
const getStrLn: T.Task<string> = () =>
  new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("> ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });

// write to standard output
const putStrLn = flow(log, T.fromIO);

// ask something and get the answer
function ask(question: string): T.Task<string> {
  return pipe(
    putStrLn(question),
    T.chain(() => getStrLn)
  );
}

function squareAt(board: Board, row: Row, column: Column): O.Option<Square> {
  return pipe(
    board.squares,
    A.findFirst(
      (square: Square) => square.column === column && square.row === row
    )
  );
}

function printBoard(board: Board) {
  return pipe(
    // generate empty board (8x8 two-dimensional array)
    A.range(1, 8),
    A.map((_) => A.replicate(8, "")),

    // draw each piece
    A.mapWithIndex((row, pieces) =>
      A.array.mapWithIndex(pieces, (column) =>
        pipe(
          squareAt(board, Row.reverseGet(row), Column.reverseGet(column)),
          O.fold(constant("."), pieceFromSquare)
        )
      )
    ),

    // add row numbers 1/2/3/4..
    A.mapWithIndex(
      flow((rowIndex, row) => A.cons(Row.reverseGet(rowIndex), row))
    ),

    // add column numbers a/b/c/d..
    A.cons([" ", ...A.range(0, 7).map(Column.reverseGet)]),

    // reverse board so first row is at bottom,
    A.reverse,

    // format as string
    A.map(join(" ")),
    join("\n")
  );
}

// parse a chess move
function parse(input: string): E.Either<string, Move> {
  return pipe(
    input,
    split(""),
    ([fromColumn, fromRow, toColumn, toRow]) =>
      ({ fromColumn, fromRow, toColumn, toRow } as Move),
    E.fromPredicate(
      (move) =>
        isColumn(move.fromColumn) &&
        isRow(move.fromRow) &&
        isColumn(move.toColumn) &&
        isRow(move.toRow),
      () => "Move is invalid!"
    )
  );
}

// print board to the console
const showBoard = flow(printBoard, (str) => `\n${str}\n`, log);

function gameLoop(board: Board): T.Task<Board> {
  return pipe(
    flow(showBoard(board), ask(`What is your move (eg: e2e4) ?`)),
    T.chain((move) =>
      pipe(
        parse(move),
        E.fold(
          (err) => pipe(putStrLn(err), T.apSecond(T.of(board))),
          (move: Move) => T.of(applyMove(move, board))
        )
      )
    ),
    T.chain(gameLoop)
  );
}

const main: T.Task<Board> = flow(putStrLn(`Welcome to the chess game!`), () =>
  gameLoop(defaultBoard)
)();

// tslint:disable-next-line: no-floating-promises
main();
