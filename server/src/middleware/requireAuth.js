import {verifyToken} from "../services/jwt.service.js";

export function requireAuth(req, res, next) {
    const token = req.cookies?.access_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {

        return res.status(401).json({message: "Invalid token"});
    }
}
