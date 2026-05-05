import { Chess } from "chess.js";

export function createGame(fen?: string) {
  return new Chess(fen);
}

export function makeMove(game: Chess, move: any) {
  try {
    const result = game.move(move);
    return result !== null;
  } catch {
    return false;
  }
}

export function getFen(game: Chess) {
  return game.fen();
}