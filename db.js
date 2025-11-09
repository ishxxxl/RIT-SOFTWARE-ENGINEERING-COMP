const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // your username
  password: "454278", // your MariaDB password
  database: "needsconnect"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MariaDB");
  }
});

module.exports = db;
