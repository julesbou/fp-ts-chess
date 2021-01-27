"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMove = void 0;
const monocle_ts_1 = require("monocle-ts");
const A = require("fp-ts/Array");
function applyMove(move, board) {
    const getSquarePrism = (move) => monocle_ts_1.Prism.fromPredicate(square => square.column === move.fromColumn &&
        square.row === move.fromRow);
    const getLens = (move) => monocle_ts_1.Lens.fromProp()('squares')
        .composeTraversal(monocle_ts_1.fromTraversable(A.array)())
        .composePrism(getSquarePrism(move));
    const doMove = (move) => getLens(move).modify((square) => {
        square.column = move.toColumn;
        square.row = move.toRow;
        return square;
    });
    return doMove(move)(board);
}
exports.applyMove = applyMove;
