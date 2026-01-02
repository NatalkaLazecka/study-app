import { verifyToken } from "../services/jwt.service.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.access_token || req.cookies?.auth_token;
  console.log('[DEBUG] requireAuth: req.cookies =', req.cookies);
  console.log('[DEBUG] requireAuth: token =', token);

  if (!token) {
    console.log('[DEBUG] requireAuth: no token -> 401');
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = verifyToken(token);
    console.log('[DEBUG] requireAuth: token decoded =', decoded);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    console.log('[DEBUG] requireAuth: token invalid ->', err?.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}