import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "34.57.186.71",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "m>P?_9C[H*|H>8|l",
  database: process.env.DB_NAME || "study",
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

export default pool;
