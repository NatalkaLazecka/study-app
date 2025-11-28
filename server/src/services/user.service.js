import bcrypt from "bcryptjs";
import db from '../database/db.js';

export async function findUserByEmail(email) {
    const [rows] = await db.query(
        "SELECT * FROM student WHERE email = ?",
        [email]
    );
    return rows[0];
}

export async function findUserById(id) {
    const [rows] = await db.query(
        "SELECT * FROM student WHERE id = ?",
        [id]
    );
    return rows[0];
}

export async function createUser({id, email, password, imie, nazwisko}) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
        `INSERT INTO student (id, e_mail, haslo, imie, nazwisko, data_rejestracji)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [id, email, hashedPassword, imie, nazwisko]
    );
}