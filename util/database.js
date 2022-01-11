const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "worthie-db-1.cfjqggg9labm.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "public_user",
  password: "2I&bVu@qb1xNrWGVcNqJWTu",
  database: "worthie-db",
});

// localhost connection
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "fintrackerdb",
//   password: "pass",
// });

module.exports = pool.promise();
