import bcrypt from "bcryptjs";
import db from '../database/db.js';

export async function findUserByEmail(email) {
    try {
        const [rows] = await db.query(
            "SELECT id, e_mail, haslo, imie, nazwisko, data_rejestracji FROM student WHERE e_mail = ?",
            [email]
        );

        return rows[0] || null;
    } catch (err) {
        console.log('Log in fail. Database query error:', err);
        throw err;
    }
}

export async function findUserById(id) {
    try {
        const [rows] = await db.query(
            "SELECT id, e_mail, haslo, imie, nazwisko, data_rejestracji FROM student WHERE id = ?",
            [id]
        );

        return rows[0] || null;
    } catch (err) {
        console.log('Log in fail. Database query error:', err);
        throw err;
    }
}

export async function createUser({id, email, password, imie = "", nazwisko = ""}) {
    console.log('👤 createUser RECEIVED:', {
        id,
        e_mail,
        haslo,
        imie,
        nazwisko
    });

    console.log('👤 createUser types:', {
        id_type: typeof id,
        e_mail_type: typeof e_mail,
        haslo_type: typeof haslo,
        imie_type:  typeof imie,
        nazwisko_type: typeof nazwisko
    });

    console.log('🔐 Hashing password:', haslo. substring(0, 3) + '***');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    await db.query(
        `INSERT INTO student (id, e_mail, haslo, imie, nazwisko, data_rejestracji)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [id, email, hashedPassword, imie, nazwisko]
    );
}