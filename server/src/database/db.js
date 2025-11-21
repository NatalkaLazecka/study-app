import mysql from "mysql";
import util from "util";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "34.57.186.71",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "m>P?_9C[H*|H>8|l",
  database: process.env.DB_NAME || "study",
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true
});

pool.query = util.promisify(pool.query);
export default pool;
