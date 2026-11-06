// db.js
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // walang password ang default ng XAMPP
  database: "divaa_hotel", // palitan kung iba ang pangalan ng database mo
  waitForConnections: true,
  connectionLimit: 10,
});

pool
  .query("SELECT 1")
  .then(() => console.log("MySQL connected"))
  .catch((err) => console.error("MySQL error:", err.message));

export default pool;
