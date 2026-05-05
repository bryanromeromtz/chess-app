import { createGame, makeMove } from "./chess";

describe("Chess logic", () => {
  test("permite movimiento válido", () => {
    const game = createGame();

    const result = makeMove(game, {
      from: "e2",
      to: "e4",
    });

    expect(result).toBe(true);
  });

  test("rechaza movimiento inválido", () => {
    const game = createGame();

    const result = makeMove(game, {
      from: "e2",
      to: "e5",
    });

    expect(result).toBe(false);
  });
});