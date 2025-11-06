import mysql from "mysql";
import util from "util";

const pool = mysql.createPool({
  host: "34.57.186.71",
  port: 3306,
  user: "root",
  password: "m>P?_9C[H*|H>8|l",
  database: "study",
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
