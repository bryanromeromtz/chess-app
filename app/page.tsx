"use client";

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import { createGame, sendMove, getAiMove } from "@/lib/api";

export default function Home() {
  const [game, setGame] = useState(new Chess());
  const [gameId, setGameId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("active");
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    async function initGame() {
      const savedId = localStorage.getItem("chess-game-id");

      if (savedId) {
        setGameId(Number(savedId));
        const savedFen = localStorage.getItem("chess-game-fen");
        if (savedFen) setGame(new Chess(savedFen));
        return;
      }

      const data = await createGame();
      setGameId(data.id);
      localStorage.setItem("chess-game-id", String(data.id));
    }

    initGame();
  }, []);

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean {
    if (!targetSquare || gameId === null) return false;
    if (status !== "active") return false;
    if (thinking) return false;

    handleMove(sourceSquare, targetSquare);
    return true;
  }

  async function handleMove(sourceSquare: string, targetSquare: string) {
    if (gameId === null) return;

    // movimiento del jugador
    const data = await sendMove(gameId, sourceSquare, targetSquare, "q");

    if (data.error) {
      setGame(new Chess(game.fen()));
      return;
    }

    setGame(new Chess(data.fen));
    setStatus(data.status);
    localStorage.setItem("chess-game-fen", data.fen);

    // si la partida terminó no pedimos movimiento a la IA
    if (data.status !== "active") return;

    // turno de la IA
    setThinking(true);
    const aiData = await getAiMove(gameId);
    setThinking(false);

    if (aiData.error) return;

    setGame(new Chess(aiData.fen));
    setStatus(aiData.status);
    localStorage.setItem("chess-game-fen", aiData.fen);
  }

  function resetGame() {
    localStorage.removeItem("chess-game-id");
    localStorage.removeItem("chess-game-fen");
    setGame(new Chess());
    setStatus("active");
    setGameId(null);
    setThinking(false);

    createGame().then((data) => {
      setGameId(data.id);
      localStorage.setItem("chess-game-id", String(data.id));
    });
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="w-[600px] max-w-full">
        <Chessboard
          options={{
            position: game.fen(),
            onPieceDrop,
          }}
        />
      </div>

      <p className="text-center mt-4">
        {thinking
          ? "IA pensando..."
          : `Turno: ${game.turn() === "w" ? "Blancas" : "Negras"}`}
      </p>

      {status === "checkmate" && (
        <p className="text-red-500 mt-2">Jaque mate</p>
      )}
      {status === "draw" && (
        <p className="text-yellow-500 mt-2">Empate</p>
      )}

      <button
        onClick={resetGame}
        disabled={thinking}
        className="mt-4 px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        Reiniciar partida
      </button>

      {gameId && (
        <p className="text-gray-400 text-sm mt-2">Partida #{gameId}</p>
      )}
    </div>
  );
}