
import crypto from 'crypto'

// Przechowujemy tokeny w pamięci
const tokens = new Map()

// Tworzy unikalny token z TTL
export function issueToken(email, ttlMs = 3600000) {
  const token = crypto.randomBytes(32).toString('hex')
  tokens.set(token, { email, expiresAt: Date.now() + ttlMs })
  return token
}

// Weryfikuje, czy token istnieje i jest ważny
export function verifyToken(token) {
  const entry = tokens.get(token)
  if (!entry) return { valid: false, reason: 'not_found' }

  if (Date.now() > entry.expiresAt) {
    tokens.delete(token)
    return { valid: false, reason: 'expired' }
  }

  return { valid: true, email: entry.email }
}

// Usuwa token po użyciu
export function consumeToken(token) {
  tokens.delete(token)
}
