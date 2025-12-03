import bcrypt from "bcryptjs";
import db from '../database/db.js';

export async function findUserByEmail(email) {
    try{
        const rows = await db.query(
            "SELECT * FROM student WHERE e_mail = ?",
            [email]
        );


        return rows[0] || null;
    } catch (err) {
        console.error('Log in fail. Database query error:', err);
        throw err;
    }
}

export async function findUserById(id) {
    const rows = await db.query(
        "SELECT * FROM student WHERE id = ?",
        [id]
    );
    return rows[0] || null;
}

export async function createUser({id, email, password, imie, nazwisko}) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
        `INSERT INTO student (id, e_mail, haslo, imie, nazwisko, data_rejestracji)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [id, email, hashedPassword, imie, nazwisko]
    );
}