import { createInterface } from 'readline'
import { log } from 'fp-ts/Console'
import { pipe, flow, constant } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/Option'

import { defaultBoard, Board, Square, Column, Row, pieceFromSquare } from './board'
import { applyMove, Move, isColumn, isRow } from './move'

// read from standard input
const getStrLn: T.Task<string> = () =>
  new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question('> ', (answer) => {
      rl.close()
      resolve(answer)
    })
  })

// write to standard output
const putStrLn = flow(log, T.fromIO)

// ask something and get the answer
function ask(question: string): T.Task<string> {
  return pipe(
    putStrLn(question),
    T.chain(() => getStrLn)
  )
}

function squareAt/*: O.Option<Square>*/(board: Board, rowIndex: number, columnIndex: number) {
  return O.fromNullable(board.squares.find((square: Square) => 
    Column.get(square.column) === columnIndex && 
    Row.get(square.row) === rowIndex
  ))
}

function printBoard(board: Board) {
  return pipe(
    // generate empty board (8x8 two-dimensional array)
    A.range(1, 8),
    A.map(_ => A.replicate(8, '')),

    // draw each piece
    A.mapWithIndex((row, pieces) =>
      A.array.mapWithIndex(pieces, column => pipe(
        squareAt(board, 7 - row, column),
        O.fold(
          constant('.'),
          pieceFromSquare
        )
      ))
    ),

    // add row numbers 1/2/3/4..
    A.mapWithIndex(
      flow((rowIndex, row) => A.cons(Row.reverseGet(7 - rowIndex), row)),
    ),

    // add column numbers a/b/c/d..
    (rows => A.snoc(rows,
      [' ', ...A.range(0, 7).map(Column.reverseGet)],
    )),

    // format as string
    A.map(a => a.join(' ')),
  ).join('\n')
}

// parse a chess move
function parse(s: string): E.Either<string, Move> {
  const [fromColumn, fromRow, toColumn, toRow] = s.split('')
  if (!isColumn(fromColumn) || !isRow(fromRow) || !isColumn(toColumn) || !isRow(toRow)) {
    return E.left('Move is invalid!')
  }
  return E.right({ fromColumn, fromRow, toColumn, toRow })
}

// print board to the console
const showBoard = flow(printBoard, str => `\n${str}\n`, log)


function gameLoop(board: Board): T.Task<Board> {
  return pipe(
    flow(
      showBoard(board), 
      ask(`What is your move (eg: e2e4) ?`)
    ),
    T.chain(move => 
      pipe(
        parse(move),
        E.fold(
          (err) => pipe(
            putStrLn(err),
            T.apSecond(T.of(board)),
          ),
          (move: Move) =>
            T.of(applyMove(move, board))
          ,
        ),
      )
    ),
    T.chain(gameLoop)
  )
}

const main: T.Task<Board> = flow(
  putStrLn(`Welcome to the chess game!`),
  () => gameLoop(defaultBoard),
)()

// tslint:disable-next-line: no-floating-promises
main()