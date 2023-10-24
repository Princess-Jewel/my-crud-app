const db = require("../config/databaseConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");

async function registerUser(fname, lname, age, email, password, callback) {
  try {
    // First check if email exists in the database
    const user = await Users.findOne({ where: { email: email } });

    if (user) {
      console.log("Email already exists");
      callback("Email already exists", null); // Email is already in use
    } else {
      // Email is not in use, proceed with registration
      const newUser = await Users.create({
        fname,
        lname,
        age,
        email,
        password,
      });

      if (newUser) {
        console.log("Registration successful");
        callback(null, {
          message: "Registration successful",
          id: newUser.id,
        });
      } else {
        callback("Registration failed", null);
      }
    }
  } catch (err) {
    console.log(err);
    callback(err, null); // Handle any errors
  }
}

async function loginUser(email, password, res) {
  try {
    // First check if email exists in the database
    const user = await Users.findOne({ where: { email: email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("Login failed");
      return res.status(401).json({ error: "Login failed" });
    } else {
      // User exists so proceed with login
      const id = user.id;

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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
