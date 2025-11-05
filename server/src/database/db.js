import mysql from "mysql";
import util from "util";

const pool = mysql.createPool({
  host: "34.57.186.71",
  user: "root",
  password: "m>P?_9C[H*|H>8|l",
  database: "study",
});

pool.query = util.promisify(pool.query);
export default pool;
