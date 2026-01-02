import { verifyToken } from "../services/jwt.service.js";

export function requireAuth(req, res, next) {
  console.log("[DEBUG] requireAuth: req.cookies =", req.cookies);

  const token = req.cookies?.access_token;

  console.log("[DEBUG] requireAuth: token =", token);

  if (!token) {
    console.log("[DEBUG] requireAuth: no token -> 401");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("[DEBUG] requireAuth: invalid token", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
