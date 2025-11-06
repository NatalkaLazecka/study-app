import mysql from "mysql";
import util from "util";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10
});

//test
// async function test(){
//     try{
//         const [rows] = await pool.query("SELECT 1 + 1 AS solution");
//         console.log("The solution is: ", rows[0].solution);
//     }catch (err){
//         console.error("Error executing query: ", err);
//     }
// }
//
// test();

pool.query = util.promisify(pool.query);
export default pool;
