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


// wykryj, czy połączenie jest secure (np. za proxy x-forwarded-proto: 'https')
        const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
// przed isSecure / res.cookie

        console.log('[DEBUG] login: req.secure =', req.secure);
        console.log('[DEBUG] login: x-forwarded-proto =', req.headers['x-forwarded-proto']);
        console.log('[DEBUG] login: isSecure =', isSecure);
// ustaw cookie - secure tylko gdy rzeczywiście HTTPS (w prod będzie true za proxy)
        // TYLKO DO TESTU: wymuś secure: false i sameSite: 'lax'
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        console.log('[DEBUG] login: set cookie with secure:false (test)');

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