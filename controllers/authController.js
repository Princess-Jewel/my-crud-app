const db = require("../config/databaseConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");

async function registerUser(fname, lname, age, email, password, callback) {
  try {
    // First check if email exists in the database
    const user = await Users.findOne({ where: { email: email } });

    if (user) {
      return res.status(401).json({ error: "Email already exists" }); // Email is already in use
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
        callback(null, {
          message: "Registration successful",
          id: newUser.id,
        });
      } else {
        return res.status(401).json({ error: "Registration failed" });
      }
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
}

async function loginUser(email, password, res) {
  try {
    // First check if email exists in the database
    const user = await Users.findOne({ where: { email: email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
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
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
