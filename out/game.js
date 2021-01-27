"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const Console_1 = require("fp-ts/Console");
const function_1 = require("fp-ts/function");
const String_1 = require("fp-ts-extras/lib/String");
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
function squareAt(board, row, column) {
    return function_1.pipe(board.squares, A.findFirst((square) => square.column === column && square.row === row));
}
function printBoard(board) {
    return function_1.pipe(
    // generate empty board (8x8 two-dimensional array)
    A.range(1, 8), A.map(_ => A.replicate(8, '')), 
    // draw each piece
    A.mapWithIndex((row, pieces) => A.array.mapWithIndex(pieces, column => function_1.pipe(squareAt(board, board_1.Row.reverseGet(7 - row), board_1.Column.reverseGet(column)), O.fold(function_1.constant('.'), board_1.pieceFromSquare)))), 
    // add row numbers 1/2/3/4..
    A.mapWithIndex(function_1.flow((rowIndex, row) => A.cons(board_1.Row.reverseGet(7 - rowIndex), row))), 
    // add column numbers a/b/c/d..
    (rows => A.snoc(rows, [' ', ...A.range(0, 7).map(board_1.Column.reverseGet)])), 
    // format as string
    A.map(String_1.join(' ')), String_1.join('\n'));
}
// parse a chess move
function parse(input) {
    return function_1.pipe(input, String_1.split(''), ([fromColumn, fromRow, toColumn, toRow]) => ({ fromColumn, fromRow, toColumn, toRow }), E.fromPredicate((move) => board_1.isColumn(move.fromColumn) || board_1.isRow(move.fromRow) || board_1.isColumn(move.toColumn) || board_1.isRow(move.toRow), () => 'Move is invalid!'));
}
// print board to the console
const showBoard = function_1.flow(printBoard, str => `\n${str}\n`, Console_1.log);
function gameLoop(board) {
    return function_1.pipe(function_1.flow(showBoard(board), ask(`What is your move (eg: e2e4) ?`)), T.chain(move => function_1.pipe(parse(move), E.fold((err) => function_1.pipe(putStrLn(err), T.apSecond(T.of(board))), (move) => T.of(move_1.applyMove(move, board))))), T.chain(gameLoop));
}
const main = function_1.flow(putStrLn(`Welcome to the chess game!`), () => gameLoop(board_1.defaultBoard))();
// tslint:disable-next-line: no-floating-promises
main();
