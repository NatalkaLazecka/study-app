import { findUserByEmail, createUser } from "../services/user.service.js";
import { issueToken, verifyToken, consumeToken } from "../services/reset-token.service.js";
import { sendResetEmail } from "../services/email.service.js";
import bcrypt from "bcryptjs";
import db from "../database/db.js";

export async function requestPasswordReset(req, res) {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    // Token ważny 1h
    const token = issueToken(email);
    await sendResetEmail(email, token);

    res.json({ ok: true });
}

export async function verifyResetToken(req, res) {
    const { token } = req.query;

    const result = verifyToken(token);
    res.json(result);
}

export async function confirmPasswordReset(req, res) {
    const { token, newPassword } = req.body;

    const result = verifyToken(token);
    if (!result.valid) {
        return res.status(400).json({ error: "Token invalid or expired" });
    }

    // Hash nowego hasła
    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
        "UPDATE student SET haslo = ? WHERE e_mail = ?",
        [hashed, result.email]
    );

    consumeToken(token);
    res.json({ ok: true });
}
