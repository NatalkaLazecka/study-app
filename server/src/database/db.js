import mysql from "mysql2";
import crypto from "crypto";
import { env } from "../config/env.js";

const EXPECTED_FINGERPRINT =
  "1AEC008506459C14AF150CB020931725E525619B8C4C7851F5EE3618E851B7C3";

const pool = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,

    ssl: {
        rejectUnauthorized: false,

        checkServerIdentity: (host, cert) => {
            if (!cert || !cert.raw) {
                throw new Error("No server certificate received");
            }

            const fingerprint = crypto
                .createHash("sha256")
                .update(cert.raw)
                .digest("hex")
                .toUpperCase();

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
