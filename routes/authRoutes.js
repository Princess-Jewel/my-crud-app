const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const bcrypt = require("bcrypt");
const Users = require("../models/users");


// POST
// @desc register new users
// @route POST /auth/register
// @access public
router.post("/register", async (req, res) => {
  try {
    const { fname, lname, age, email, password: Npassword } = req.body;

    if (!fname || !lname || !email || !Npassword || !age) {
      res.status(400).json({ error: "All fields are mandatory" });
      return;
    }

    const salt = await bcrypt.genSalt(8);
    const password = await bcrypt.hash(Npassword, salt);

    await Users.create({
      fname,
      lname,
      age,
      email,
      password,
    });
    res.status(201).json({ message: "New contact registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// POST
// @desc login new users
// @route POST /auth/login
// @access public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      return res.json({
        status: "error",
        error: "Please enter your email and password",
      });
    }

    await loginUser(email, password, res, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }

      return res.status(201).json({ message: "Login successful" });
    });
  } catch (error) {

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
