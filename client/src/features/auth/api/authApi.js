const API = import.meta.env.VITE_API_URL;
import axios from "axios";

export async function sendResetEmail(email) {
  return axios.post(`${API}/api/emails/reset`, { email });
}

export async function verifyToken(token) {
  const res = await axios.get(`${API}/api/emails/verify/${token}`);
  return res.data;
}

export async function resetPassword({ token, newPassword }) {
  return axios.post(`${API}/api/emails/reset-password`, {
    token,
    newPassword
  });
}



export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
}

export async function register(data) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Register failed");

  return res.json();
}
