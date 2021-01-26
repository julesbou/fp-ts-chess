"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const Console_1 = require("fp-ts/Console");
const function_1 = require("fp-ts/function");
const E = require("fp-ts/Either");
const T = require("fp-ts/Task");
const A = require("fp-ts/lib/Array");
const O = require("fp-ts/Option");
const board_1 = require("./board");
const move_1 = require("./move");
// read from standard input
const getStrLn = () => new Promise((resolve) => {
    const rl = readline_1.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('> ', (answer) => {
        rl.close();
        resolve(answer);
    });
});
// write to standard output
const putStrLn = function_1.flow(Console_1.log, T.fromIO);
// ask something and get the answer
function ask(question) {
    return function_1.pipe(putStrLn(question), T.chain(() => getStrLn));
}
function squareAt /*: O.Option<Square>*/(board, rowIndex, columnIndex) {
    return O.fromNullable(board.squares.find((square) => board_1.Column.get(square.column) === columnIndex &&
        board_1.Row.get(square.row) === rowIndex));
}
function printBoard(board) {
    return function_1.pipe(
    // generate empty board (8x8 two-dimensional array)
    A.range(1, 8), A.map(_ => A.replicate(8, '')), 
    // draw each piece
    A.mapWithIndex((row, pieces) => A.array.mapWithIndex(pieces, column => function_1.pipe(squareAt(board, 7 - row, column), O.fold(function_1.constant('.'), board_1.pieceFromSquare)))), 
    // add row numbers 1/2/3/4..
    A.mapWithIndex(function_1.flow((rowIndex, row) => A.cons(board_1.Row.reverseGet(7 - rowIndex), row))), 
    // add column numbers a/b/c/d..
    (rows => A.snoc(rows, [' ', ...A.range(0, 7).map(board_1.Column.reverseGet)])), 
    // format as string
    A.map(a => a.join(' '))).join('\n');
}
// parse a chess move
function parse(s) {
    const [fromColumn, fromRow, toColumn, toRow] = s.split('');
    if (!move_1.isColumn(fromColumn) || !move_1.isRow(fromRow) || !move_1.isColumn(toColumn) || !move_1.isRow(toRow)) {
        return E.left('Move is invalid!');
    }
    return E.right({ fromColumn, fromRow, toColumn, toRow });
}
// print board to the console
const showBoard = function_1.flow(printBoard, str => `\n${str}\n`, Console_1.log);
function gameLoop(board) {
    return function_1.pipe(function_1.flow(showBoard(board), ask(`What is your move (eg: e2e4) ?`)), T.chain(move => function_1.pipe(parse(move), E.fold((err) => function_1.pipe(putStrLn(err), T.apSecond(T.of(board))), (move) => T.of(move_1.applyMove(move, board))))), T.chain(gameLoop));
}
const main = function_1.flow(putStrLn(`Welcome to the chess game!`), () => gameLoop(board_1.defaultBoard))();
// tslint:disable-next-line: no-floating-promises
main();
