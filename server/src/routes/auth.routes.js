import express from 'express';
import { login, register, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);

export default router;