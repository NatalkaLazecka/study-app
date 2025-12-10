console.log("emails.routes.js ZAŁADOWANY");

import { Router } from "express";
import {
  issueToken,
  verifyToken,
  consumeToken
} from "../services/token.service.js";
import { sendResetEmail } from "../services/email.service.js";
import db from "../database/db.js";
import bcrypt from "bcryptjs";

const router = Router();

//  Wysyłanie linku resetu
router.post("/reset", async (req, res) => {
    console.log("ODEBRANO POST /api/emails/reset");
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Brak adresu e-mail" });
    }

    const rows = await db.query("SELECT * FROM student WHERE e_mail = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "Użytkownik nie istnieje" });
    }

    const token = issueToken(email);
    await sendResetEmail(email, token);

    res.json({ ok: true, message: "Email resetujący wysłany" });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Błąd wysyłania e-maila" });
  }
});

// Walidacja tokenu
router.get("/verify/:token", (req, res) => {
   console.log("ODEBRANO GET /api/emails/verify");
  const token = req.params.token;
  const data = verifyToken(token);

  if (!data.valid) {
    return res.status(400).json({ valid: false });
  }

  res.json({ valid: true, email: data.email });
});

// Ustawianie nowego hasła
router.post("/reset-password", async (req, res) => {
 console.log("ODEBRANO POST /api/emails/reset-password");
  try {
    const { token, newPassword } = req.body;
    const data = verifyToken(token);

    if (!data.valid) {
      return res.status(400).json({
        success: false,
        message: "Token wygasł lub nieprawidłowy"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE student SET haslo = ? WHERE e_mail = ?", [
      hashed,
      data.email
    ]);

    consumeToken(token);

    res.json({ success: true, message: "Hasło zostało zmienione" });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Błąd przy zmianie hasła"
    });
  }
});

export default router;
