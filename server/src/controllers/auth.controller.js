import {v4 as uuid} from 'uuid';
import bcrypt from "bcryptjs";
import {findUserByEmail, createUser, findUserById} from '../services/user.service.js';
import {generateToken} from '../services/jwt.service.js';

export async function register(req, res) {
    const {email, password, imie, nazwisko} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password fields are required'});
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
        res.status(500).json({error: 'Registration failed'});
    }
}

export async function login(req, res) {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({error: 'Invalid credentials'});

        const isValid = await bcrypt.compare(password, user.haslo);
        if (!isValid) return res.status(401).json({error: 'Invalid credentials'});

        const token = generateToken(user);
        
        console.log('[DEBUG] login: user.id=', user.id);
        console.log('[DEBUG] login: token (first 50 chars)=', token?.slice?.(0, 50));
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        };
        console.log('[DEBUG] login: cookieOptions=', cookieOptions);

        res.cookie("access_token", token, cookieOptions);

        res.json({
            user: {
                id: user.id,
                email: user.e_mail,
                imie: user.imie,
                nazwisko: user.nazwisko
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({error: 'Login failed'});
    }
}

export async function me(req, res) {
    const user = await findUserById(req.user.id);
    res.json({user});
}

export function logout(req, res) {
    res.clearCookie("access_token");
    res.json({ok: true});
}