const API = import.meta.env.VITE_API_URL;


export async function sendResetEmail(email) {
  const res = await fetch(`${API}/api/emails/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Failed to send reset email");
  }

  return res.json();
}

export async function verifyResetToken(token) {
  const res = await fetch(`${API}/api/emails/verify/${token}`);

  if (!res.ok) {
    throw new Error("Invalid or expired token");
  }

  return res.json();
}


export async function resetPassword({ token, newPassword }) {
  const res = await fetch(`${API}/api/emails/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    throw new Error("Password reset failed");
  }

  return res.json();
}


export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      e_mail: email,
      haslo: password,
    }),
  });


  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}
export async function register(data) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  return res.json();
}
