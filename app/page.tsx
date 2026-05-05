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
    const data = await sendMove(gameId, sourceSquare, targetSquare, "q");
    if (data.error) {
      setGame(new Chess(game.fen()));
      return;
    }
    setGame(new Chess(data.fen));
    setStatus(data.status);
    localStorage.setItem("chess-game-fen", data.fen);
    if (data.status !== "active") return;
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

  function getStatusMessage() {
    if (thinking) return "♟ IA pensando...";
    if (status === "checkmate") return "👑 Jaque mate";
    if (status === "draw") return "🤝 Empate";
    return game.turn() === "w" ? "⬜ Turno: Blancas" : "⬛ Turno: Negras";
  }

  function getStatusColor() {
    if (status === "checkmate") return "#b33430";
    if (status === "draw") return "#b07800";
    if (thinking) return "#4a6741";
    return "#2c2c2c";
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      {/* titulo */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h1 style={{
          color: "#f0d9b5",
          fontSize: "32px",
          fontWeight: "bold",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}>
          ♔ 36 Chambers Chess ♚
        </h1>
        <p style={{ color: "#b58863", fontSize: "13px", letterSpacing: "2px" }}>
          Powered by stockfish
        </p>
        {/* // y mi nombre */}
        <p style={{ color: "#b58863", fontSize: "11px", letterSpacing: "1px", marginTop: "6px" }}>
          created by bzilla
        </p>
      </div>

      {/* tablero */}
      <div style={{
        background: "#2c2c2c",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }}>
        <div style={{ width: "560px", maxWidth: "90vw" }}>
          <Chessboard
            options={{
              position: game.fen(),
              onPieceDrop,
            }}
          />
        </div>
      </div>

      {/* estado */}
      <div style={{
        marginTop: "20px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(240,217,181,0.2)",
        borderRadius: "8px",
        padding: "12px 32px",
        backdropFilter: "blur(10px)",
      }}>
        <p style={{
          color: getStatusColor(),
          fontSize: "16px",
          fontWeight: "600",
          textAlign: "center",
          background: "rgba(240,217,181,0.9)",
          padding: "8px 20px",
          borderRadius: "6px",
          minWidth: "200px",
        }}>
          {getStatusMessage()}
        </p>
      </div>

      {/* boton reset */}
      <button
        onClick={resetGame}
        disabled={thinking}
        style={{
          marginTop: "16px",
          padding: "10px 28px",
          background: thinking ? "#555" : "#b58863",
          color: "#1a1a2e",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: thinking ? "not-allowed" : "pointer",
          letterSpacing: "1px",
          textTransform: "uppercase",
          transition: "background 0.2s",
        }}
      >
        Nueva partida
      </button>

      {gameId && (
        <p style={{
          marginTop: "10px",
          color: "rgba(240,217,181,0.4)",
          fontSize: "12px",
          letterSpacing: "1px",
        }}>
          Partida #{gameId}
        </p>
      )}
    </div>
  );
}