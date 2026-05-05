const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getToken() {
  return localStorage.getItem("chess-token");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// auth
export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// partidas
export async function createGame() {
  const res = await fetch(`${API_URL}/games`, {
    method: "POST",
    headers: authHeaders(),
  });
  return res.json();
}

export async function getGame(id: number) {
  const res = await fetch(`${API_URL}/games/${id}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function sendMove(id: number, from: string, to: string, promotion?: string) {
  const res = await fetch(`${API_URL}/games/${id}/move`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ from, to, promotion }),
  });
  return res.json();
}

export async function getAiMove(id: number) {
  const res = await fetch(`${API_URL}/games/${id}/ai-move`, {
    method: "POST",
    headers: authHeaders(),
  });
  return res.json();
}