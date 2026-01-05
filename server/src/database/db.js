import mysql from "mysql2";
import { env } from "../config/env.js";

const pool = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,

    ssl: {
        rejectUnauthorized: true,
        ca: env.DB_SSL_CA?.replace(/\\n/g, "\n"),

    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise();

console.log("CA loaded length:", env.DB_SSL_CA?.length);


export default pool;
