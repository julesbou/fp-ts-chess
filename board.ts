import { pipe, flow, constant } from 'fp-ts/function'
import { Iso } from 'monocle-ts/lib/Iso'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/lib/Array'

type Color = 'white' | 'black'
type PieceType = 'PAWN' | 'ROOK' | 'KNIGHT' | 'BISHOP' | 'KING' | 'QUEEN'
type Column = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
type Row = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'

type PieceSet = {
  PAWN: string;
  ROOK: string;
  KNIGHT: string;
  BISHOP: string;
  KING: string;
  QUEEN: string;
} & Record<PieceType, string> 

type Square = {
  column: Column,
  row: Row,
  piece: keyof PieceSet;
  color: Color;
}

type Board = {
  direction: Color;
  squares: Square[];
}

const blackPieces: PieceSet = {
  PAWN: '♟',
  ROOK: '♜',
  KNIGHT: '♞',
  BISHOP: '♝',
  KING: '♚',
  QUEEN: '♛',
}

const whitePieces: PieceSet = {
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

const Row: Iso<string, number> = {
  get: (row: Row) => Number(row) - 1,
  reverseGet: (row: number) => String(row + 1),
}

const Column: Iso<string, number> = {
  get: (column: Column) => 'abcdefgh'.split('').indexOf(column),
  reverseGet: (column: number) => 'abcdefgh'.split('')[column],
}

const squareAt/*: O.Option<Square>*/ = (board: Board, rowIndex: number, columnIndex: number) => {
  return O.fromNullable(board.squares.find((square: Square) => 
    Column.get(square.column) === columnIndex && 
    Row.get(square.row) === rowIndex
  ))
}

const squareString/*: string*/ = (square: Square) => pieces[square.color][square.piece]

export const printBoard = (board: Board) =>
  pipe(
    // generate empty board (8x8)
    A.range(1, 8),
    A.map(_ => A.replicate(8, '')),

    // for each row
    A.mapWithIndex((row, pieces) =>
      // for each square of each row
      A.array.mapWithIndex(pieces, column => pipe(
        // put corresponding piece
        squareAt(board, row, column),
        O.fold(
          constant('.'),
          squareString
        )
      ))
    ),

    // add row numbers 1/2/3/4..
    A.mapWithIndex(
      flow(
        (rowIndex, row) => [Row.reverseGet(7 - rowIndex), ...row],
      )
    ),

    // add column numbers a/b/c/d..
    (rows => [
      ...rows, 
      [' ', ...A.range(0, 7).map(Column.reverseGet)],
    ]),

    // format as string
    A.map(a => a.join(' ')),

  ).join('\n')