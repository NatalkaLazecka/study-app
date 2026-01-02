import express from "express";
const router = express.Router();

router.get("/cookies", (req, res) => {
  console.log('[DEBUG] /api/debug/cookies - req.cookies =', req.cookies);
  res.json({
    cookies: req.cookies || {},
    headers: req.headers,
  });
});

// Endpoint z requireAuth - sprawdza, czy middleware poprawnie ustawia req.user
import { requireAuth } from "../middleware/requireAuth.js";
router.get("/me", requireAuth, (req, res) => {
  console.log('[DEBUG] /api/debug/me - req.cookies =', req.cookies, ' req.user =', req.user);
  res.json({
    cookies: req.cookies || {},
    user: req.user || null
  });
});

export default router;