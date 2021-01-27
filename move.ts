import { Board, Square, Column, Row } from './board'
import { fromTraversable, Traversal, Prism, Lens } from 'monocle-ts'
import * as A from 'fp-ts/Array'

export interface Move {
  fromColumn: Column;
  fromRow: Row;
  toColumn: Column;
  toRow: Row;
}

export function applyMove(move: Move, board: Board): Board {  

  const getSquarePrism = (move: Move): Prism<Square, Square> => 
    Prism.fromPredicate(square => 
      square.column === move.fromColumn &&
      square.row === move.fromRow
    )

  const getLens = (move: Move): Traversal<Board, Square> =>
    Lens.fromProp<Board>()('squares')
      .composeTraversal(fromTraversable(A.array)<Square>())
      .composePrism(getSquarePrism(move))

  const doMove = (move: Move) =>
    getLens(move).modify((square: Square) => {
      square.column = move.toColumn
      square.row = move.toRow
      return square
    })

  return doMove(move)(board)
}