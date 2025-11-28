import {verifyToken} from "../services/jwt.service.js";

export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({message: "Missing token"});
    }
    const token = header.split(" ")[1];

    try{
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }catch (err){
        return res.status(401).json({message: "Invalid token"});
    }

}