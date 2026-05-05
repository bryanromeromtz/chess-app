const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// crear una nueva partida en el backend
export async function createGame() {
  const res = await fetch(`${API_URL}/games`, {
    method: "POST",
  });
  return res.json();
}

// obtener el estado de una partida
export async function getGame(id: number) {
  const res = await fetch(`${API_URL}/games/${id}`);
  return res.json();
}

// enviar un movimiento al backend
export async function sendMove(id: number, from: string, to: string, promotion?: string) {
  const res = await fetch(`${API_URL}/games/${id}/move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, promotion }),
  });
  return res.json();
}

export async function getAiMove(id: number) {
  const res = await fetch(`${API_URL}/games/${id}/ai-move`, {
    method: "POST",
  });
  return res.json();
}