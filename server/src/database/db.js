import mysql from "mysql2";
import crypto from "crypto";
import { env } from "../config/env.js";

const EXPECTED_FINGERPRINT =
    "1A:EC:00:85:06:45:9C:14:AF:15:0C:B0:20:93:17:25:E5:25:61:9B:8C:4C:78:51:F5:EE:36:18:E8:51:B7:C3";

const pool = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    ssl: {
        rejectUnauthorized: true,

        checkServerIdentity: (host, cert) => {
            const fingerprint = crypto
                .createHash("sha256")
                .update(cert.raw)
                .digest("hex")
                .toUpperCase()
                .match(/.{2}/g)
                .join(":");

            if (fingerprint !== EXPECTED_FINGERPRINT) {
                throw new Error(
                    `TLS fingerprint mismatch: ${fingerprint}`
                );
            }
        },
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise();

export default pool;
