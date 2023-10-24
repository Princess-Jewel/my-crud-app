const db = require("../config/databaseConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


function registerUser(fname, lname, age, email, password, callback) {
  // First check if email exists in the database
  db.query(
    "SELECT email FROM signup_table WHERE email = ?",
    [email],
    (err, rows) => {
      if (err) {
        callback(err, null); // Handle the database error
      } else if (rows.length > 0) {
        callback("Email already exists", null); // Email is already in use
      } else {
        // Email is not in use, proceed with registration
        db.query(
          "INSERT INTO signup_table (fname, lname, age, email, password) VALUES (?,?,?,?,?)",
          [fname, lname, age, email, password],
          (err, result) => {
            console.log("registerUser", result);
            if (err) {
              callback(err, null); // Handle the database error
            } else if (result.affectedRows === 1) {
              callback(null, {
                message: "Registration successful",
                id: result.insertId,
              });
            } else {
              callback("Registration failed", null);
            }
          }
        );
      }
    }
  );
}

function loginUser(email, password, res) {
  db.query(
    "SELECT * FROM signup_table WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      } else {
      
        if (
          !result[0] ||
          !(await bcrypt.compare(password, result[0].password))
        ) {
          return res.status(401).json({ error: "Login failed" });
        } else {
          const id = result[0].id;

          const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES,
          });

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          res.cookie("userLoggedIn", token, cookieOptions);

          return res.status(200).json({
            status: "success",
            success: "User logged In",
            token,
            cookieOptions,
          });
        }
      }
    }
  );
}


module.exports = {
    registerUser,
    loginUser
  };