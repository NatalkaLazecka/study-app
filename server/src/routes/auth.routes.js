import express from 'express';
import { login, register, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { loginValidator, registerValidator } from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/register',
  registerValidator,
  validate,
  register
);

router.post(
  '/login',
  loginValidator,
  validate,
  login
);
router.get('/me', requireAuth, me);

export default router;