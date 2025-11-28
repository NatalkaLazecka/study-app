import { v4 as uuid } from 'uuid';
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, findUserById } from '../services/user.service.js';
import { generateToken } from '../services/jwt.service.js';

export async function register(req, res) {
    const { email, password, imie, nazwisko } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const id = uuid();
    await createUser({ id, email, password, imie, nazwisko });

    res.json({ ok: true });
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.haslo);
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
        token,
        user: {
            id: user.id,
            email: user.e_mail,
            imie: user.imie,
            nazwisko: user.nazwisko
        }
    });
}

export async function me(req, res) {
    const user = await findUserById(req.user.id);
    res.json({ user });
}
