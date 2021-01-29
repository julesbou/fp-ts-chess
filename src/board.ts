import { Iso } from 'monocle-ts/lib/Iso'

export type Color = 'white' | 'black'

export type PieceType = 'PAWN' | 'ROOK' | 'KNIGHT' | 'BISHOP' | 'KING' | 'QUEEN'

export type Column = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'

export type Row = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'

type PieceSet = {
  PAWN: string;
  ROOK: string;
  KNIGHT: string;
  BISHOP: string;
  KING: string;
  QUEEN: string;
} & Record<PieceType, string> 

export interface Square {
  column: Column,
  row: Row,
  piece: keyof PieceSet;
  color: Color;
}

export interface Board {
  direction: Color;
  squares: Square[];
}

const whitePieces: PieceSet = {
  PAWN: '♟',
  ROOK: '♜',
  KNIGHT: '♞',
  BISHOP: '♝',
  KING: '♚',
  QUEEN: '♛',
}

const blackPieces: PieceSet = {
  PAWN: '♙',
  ROOK: '♖',
  KNIGHT: '♘',
  BISHOP: '♗',
  KING: '♔',
  QUEEN: '♔',
}

const pieces: Record<Color, PieceSet> = {
  white: whitePieces,
  black: blackPieces,
} 

export const Row: Iso<Row, number> = {
  get: (row: Row) => Number(row) - 1,
  reverseGet: (row: number): Row => String(row + 1) as Row,
}

export const Column: Iso<Column, number> = {
  get: (column: Column) => 'abcdefgh'.split('').indexOf(column),
  reverseGet: (column: number): Column => 'abcdefgh'.split('')[column] as Column,
}

export function isColumn (col: string): col is Column {
  return 'abcdefgh'.split('').includes(col);
}

export function isRow (row: string): row is Row {
  return '12345678'.split('').includes(row);
}

export const pieceFromSquare = (square: Square): string => pieces[square.color][square.piece]

export const defaultBoard: Board = {
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
}