import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || 3001
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
export const RESEND_API_KEY = process.env.RESEND_API_KEY
