import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRES_IN = '7d';

export function generateToken(user) {
    return jwt.sign({ id: user.id,
        email: user.e_mail},
        JWT_SECRET, { expiresIn: EXPIRES_IN }
    );
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}