const mysql = require("mysql2");
require("dotenv").config();

// Buat pool koneksi, bukan koneksi tunggal
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // jumlah maksimal koneksi
  queueLimit: 0,
});

module.exports = pool;