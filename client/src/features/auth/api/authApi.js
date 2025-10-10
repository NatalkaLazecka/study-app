const API = import.meta.env.VITE_API_URL || '/api'

export const sendResetEmail = async (email) => {
  const res = await fetch(`${API}/emails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Błąd wysyłania emaila')
  return res.json()
}

export const verifyToken = async (token) => {
  const res = await fetch(`${API}/emails/verify-token/${token}`)
  if (!res.ok) return { valid: false }
  return res.json()
}

export const resetPassword = async ({ token, newPassword }) => {
  const res = await fetch(`${API}/emails/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  })
  if (!res.ok) throw new Error('Błąd podczas zmiany hasła')
  return res.json()
}
