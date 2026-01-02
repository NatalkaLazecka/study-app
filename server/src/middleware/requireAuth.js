import { verifyToken } from "../services/jwt.service.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.access_token || req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}