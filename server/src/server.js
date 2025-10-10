import express from 'express'
import cors from 'cors'
import { PORT, FRONTEND_URL } from './config/env.js'
import emailRoutes from './routes/emails.routes.js'

const app = express()

// Middleware
app.use(cors({ origin: FRONTEND_URL, methods: ['GET', 'POST'], credentials: true }))
app.use(express.json())

// Trasy
app.use('/api/emails', emailRoutes)

// Start serwera
app.listen(PORT, () => console.log(`Server działa na porcie ${PORT}`))
