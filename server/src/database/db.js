import mysql from "mysql2";
import {env} from "../config/env.js";
import fs from "fs";
import path from "path";

const ca = fs.readFileSync(
  path.resolve("src/database/rds-ca.pem")
);

const pool = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    ssl: {
        ca
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise();

export default pool;
