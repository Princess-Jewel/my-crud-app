
// const mysql = require("mysql");

// const db = mysql.createConnection({
//     user: "root",
//     host: "localhost",
//     password: "",
//     database: "signups",
//   });

//   module.exports = db;


// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL: " + err.stack);
//     return;
//   }
//   console.log("Connected to MySQL as id " + db.threadId);
// });

const Sequelize = require("sequelize");

const sequelize = new Sequelize("signups", "root", "",{
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
