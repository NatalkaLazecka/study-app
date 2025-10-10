import { Router } from 'express'
import { issueToken, verifyToken, consumeToken } from '../services/token.service.js'
import { sendResetEmail } from '../services/email.service.js'

const router = Router()

// POST /api/emails
router.post('/', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Brak adresu e-mail' })

    const token = issueToken(email)
    await sendResetEmail(email, token)

    res.json({ message: 'Email wysłany pomyślnie' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Błąd wysyłania e-maila' })
  }
})

// GET /api/emails/verify-token/:token
router.get('/verify-token/:token', (req, res) => {
  const result = verifyToken(req.params.token)
  if (!result.valid) return res.status(400).json({ valid: false })
  res.json({ valid: true, email: result.email })
})

// POST /api/emails/reset-password
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body
  const result = verifyToken(token)
  if (!result.valid)
    return res.status(400).json({ success: false, message: 'Zły lub wygasły token' })

  // Tu zapis hasła do bazy (jeśli masz DB)
  consumeToken(token)
  res.json({ success: true, message: 'Hasło zostało zmienione' })
})

export default router
