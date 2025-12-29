import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const EXPIRES_IN = "7d";

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.e_mail,
    },
    JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
