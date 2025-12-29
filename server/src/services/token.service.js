import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export function issueToken(email, ttl = "15m") {
    return jwt.sign(
        {
            email,
            purpose: "reset_password",
        },
        JWT_SECRET,
        {expiresIn: ttl}
    );
}

export function verifyToken(token) {
    try {
        const payload = jwt.verify(token, JWT_SECRET);

        if (payload.purpose !== "reset_password") {
            return {valid: false};
        }

        return {valid: true, email: payload.email};
    } catch {
        return {valid: false};
    }
}

export function consumeToken() {
}
