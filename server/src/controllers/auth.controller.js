import { v4 as uuid } from 'uuid';
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, findUserById } from '../services/user.service.js';
import { generateToken } from '../services/jwt.service.js';

export async function register(req, res) {
    const { email, password, imie, nazwisko } = req.body;

    if (!email || !password ) {
        return res. status(400).json({ error: 'Email and password fields are required' });
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({error: 'User already exists'});
        }

        const id = uuid();
        await createUser({id, email, password, imie: imie || null, nazwisko: nazwisko || null});

        res.json({ok: true});
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
    }

    try{
            console.log('🔍 Login attempt for:', email);

        const user = await findUserByEmail(email);

            console.log('👤 User object:', user);  // ✅ Zobacz cały obiekt
            console.log('👤 User type:', typeof user);  // ✅ Zobacz typ
            console.log('👤 User is null? ', user === null);  // ✅ Sprawdź null
            console.log('👤 User is array?', Array.isArray(user));  // ✅ Sprawdź czy tablica

        if (!user) {
            console.log('❌ User not found');
            return res.status(401).json({error: 'Invalid credentials'});
        }

            console.log('🔑 Stored hash:', user.haslo);  // ✅ Zobacz hash
            console.log('🔑 Email from DB:', user.e_mail);  // ✅ Zobacz email

        const isValid = await bcrypt.compare(password, user.haslo);

            console.log('✅ Password comparison result:', isValid);

        if (!isValid) {
            console. log('❌ Invalid password');
            return res.status(401).json({error: 'Invalid credentials'});
        }

            console.log('🎉 Login successful! ');

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
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
}

export async function me(req, res) {
    const user = await findUserById(req.user.id);
    res.json({ user });
}
