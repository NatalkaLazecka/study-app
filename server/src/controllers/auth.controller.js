import {v4 as uuid} from 'uuid';
import bcrypt from "bcryptjs";
import {findUserByEmail, createUser, findUserById} from '../services/user.service.js';
import {generateToken} from '../services/jwt.service.js';

export async function register(req, res) {
    const {e_mail, haslo, imie, nazwisko} = req.body;

    if (!e_mail || !haslo) {
        return res.status(400).json({error: 'Email and password fields are required'});
    }

    try {
        const existingUser = await findUserByEmail(e_mail);
        if (existingUser) {
            return res.status(400).json({error: 'User already exists'});
        }

        const id = uuid();

        await createUser({
            id,
            e_mail,
            haslo,
            imie: imie || null,
            nazwisko: nazwisko || null
        });

        res.json({ok: true});
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({error: 'Registration failed'});
    }
}

export async function login(req, res) {
    console.log("LOGIN BODY:", req.body);
    const {e_mail, haslo} = req.body;

    if (!e_mail || !haslo) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    try {
        const user = await findUserByEmail(e_mail);
        if (!user) return res.status(401).json({error: 'Invalid credentials'});

        const isValid = await bcrypt.compare(haslo, user.haslo);
        if (!isValid) return res.status(401).json({error: 'Invalid credentials'});


        const token = generateToken(user);


        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

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
    const userId = req.user.id;
    const user = await findUserById(userId);
    if(!user) return res.status(404).json({message: "User not found"});
    res.json({user});
}

export function logout(req, res) {
    res.clearCookie("access_token");
    res.json({ok: true});
}