const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config();

const { JWT_KEY, SECRET_KEY } = process.env;

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Encrypt password
    const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

    // Create new user
    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
      favorites: [],
    });

    // Save user
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user", details: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
console.log(req.body)
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Decrypt stored password
    const decryptedPassword = CryptoJS.AES.decrypt(user.password, SECRET_KEY);
    const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

    // Verify password
    if (originalPassword !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      JWT_KEY,
      { expiresIn: "3d" }
    );

    // Prepare user response
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      favorites: user.favorites,
      accessToken,
      isLoggedIn: true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: "Failed to log in", details: err.message });
  }
});

// Middleware to check authentication
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
});

module.exports = router;
