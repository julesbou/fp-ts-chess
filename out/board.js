"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBoard = exports.pieceFromSquare = exports.Column = exports.Row = void 0;
const whitePieces = {
    PAWN: '♟',
    ROOK: '♜',
    KNIGHT: '♞',
    BISHOP: '♝',
    KING: '♚',
    QUEEN: '♛',
};
const blackPieces = {
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
exports.Row = {
    get: (row) => Number(row) - 1,
    reverseGet: (row) => String(row + 1),
};
exports.Column = {
    get: (column) => 'abcdefgh'.split('').indexOf(column),
    reverseGet: (column) => 'abcdefgh'.split('')[column],
};
const pieceFromSquare /*: string*/ = (square) => pieces[square.color][square.piece];
exports.pieceFromSquare /*: string*/ = pieceFromSquare;
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
