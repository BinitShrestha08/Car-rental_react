// server/config/db.js
const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Binit@1234", // Your MySQL password
  database: "assignment_2", // Your database name
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log(err);
    console.log("Connection Failed");
  } else {
    console.log("Database connected successfully.");
  }
});

module.exports = mysqlConnection;
