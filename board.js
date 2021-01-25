"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printBoard = exports.defaultBoard = void 0;
const function_1 = require("fp-ts/function");
const O = require("fp-ts/Option");
const A = require("fp-ts/lib/Array");
const blackPieces = {
    PAWN: '♟',
    ROOK: '♜',
    KNIGHT: '♞',
    BISHOP: '♝',
    KING: '♚',
    QUEEN: '♛',
};
const whitePieces = {
    PAWN: '♙',
    ROOK: '♖',
    KNIGHT: '♘',
    BISHOP: '♗',
    KING: '♔',
    QUEEN: '♔',
};
const pieces = {
    white: whitePieces,
    black: blackPieces,
};
exports.defaultBoard = {
    direction: 'white',
    squares: [
        { column: 'a', row: '8', piece: 'ROOK', color: 'black' },
        { column: 'b', row: '8', piece: 'KNIGHT', color: 'black' },
        { column: 'c', row: '8', piece: 'BISHOP', color: 'black' },
        { column: 'd', row: '8', piece: 'QUEEN', color: 'black' },
        { column: 'e', row: '8', piece: 'KING', color: 'black' },
        { column: 'f', row: '8', piece: 'BISHOP', color: 'black' },
        { column: 'g', row: '8', piece: 'BISHOP', color: 'black' },
        { column: 'h', row: '8', piece: 'ROOK', color: 'black' },
        { column: 'a', row: '7', piece: 'PAWN', color: 'black' },
        { column: 'b', row: '7', piece: 'PAWN', color: 'black' },
        { column: 'c', row: '7', piece: 'PAWN', color: 'black' },
        { column: 'd', row: '7', piece: 'PAWN', color: 'black' },
        { column: 'e', row: '7', piece: 'PAWN', color: 'black' },
        { column: 'f', row: '7', piece: 'PAWN', color: 'black' },
        { column: 'g', row: '7', piece: 'PAWN', color: 'black' },
        { column: 'h', row: '7', piece: 'PAWN', color: 'black' },
        { column: 'a', row: '2', piece: 'PAWN', color: 'white' },
        { column: 'b', row: '2', piece: 'PAWN', color: 'white' },
        { column: 'c', row: '2', piece: 'PAWN', color: 'white' },
        { column: 'd', row: '2', piece: 'PAWN', color: 'white' },
        { column: 'e', row: '2', piece: 'PAWN', color: 'white' },
        { column: 'f', row: '2', piece: 'PAWN', color: 'white' },
        { column: 'g', row: '2', piece: 'PAWN', color: 'white' },
        { column: 'h', row: '2', piece: 'PAWN', color: 'white' },
        { column: 'a', row: '1', piece: 'ROOK', color: 'white' },
        { column: 'b', row: '1', piece: 'KNIGHT', color: 'white' },
        { column: 'c', row: '1', piece: 'BISHOP', color: 'white' },
        { column: 'd', row: '1', piece: 'QUEEN', color: 'white' },
        { column: 'e', row: '1', piece: 'KING', color: 'white' },
        { column: 'f', row: '1', piece: 'BISHOP', color: 'white' },
        { column: 'g', row: '1', piece: 'BISHOP', color: 'white' },
        { column: 'h', row: '1', piece: 'ROOK', color: 'white' },
    ],
};
const Row = {
    get: (row) => Number(row) - 1,
    reverseGet: (row) => String(row + 1),
};
const Column = {
    get: (column) => 'abcdefgh'.split('').indexOf(column),
    reverseGet: (column) => 'abcdefgh'.split('')[column],
};
const squareAt /*: O.Option<Square>*/ = (board, rowIndex, columnIndex) => {
    return O.fromNullable(board.squares.find((square) => Column.get(square.column) === columnIndex &&
        Row.get(square.row) === rowIndex));
};
const squareString /*: string*/ = (square) => pieces[square.color][square.piece];
const printBoard = (board) => function_1.pipe(
// generate empty board (8x8)
A.range(1, 8), A.map(_ => A.replicate(8, '')), 
// for each row
A.mapWithIndex((row, pieces) => 
// for each square of each row
A.array.mapWithIndex(pieces, column => function_1.pipe(
// put corresponding piece
squareAt(board, row, column), O.fold(function_1.constant('.'), squareString)))), 
// add row numbers 1/2/3/4..
A.mapWithIndex(function_1.flow((rowIndex, row) => [Row.reverseGet(7 - rowIndex), ...row])), 
// add column numbers a/b/c/d..
(rows => [
    ...rows,
    [' ', ...A.range(0, 7).map(Column.reverseGet)],
]), 
// format as string
A.map(a => a.join(' '))).join('\n');
exports.printBoard = printBoard;
