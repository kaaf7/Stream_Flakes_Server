const router = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");
const User = require("./models/User");
const Media = require("./models/Media");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
dotenv.config();
const JWT_KEY = process.env.JWT_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/register", async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, SECRET_KEY).toString(),
    favorites:[],
  });
  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json("Wrong Username");
    } else {
      const accessToken = jsonwebtoken.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWT_KEY,
        { expiresIn: "3d" }
      );
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      );
      const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
      if (originalPassword !== req.body.password) {
        return res.status(401).json("wrong password");
      } else if (
        originalPassword !== req.body.password &&
        user.username !== req.body.username
      ) {
        return res.status(401).json("wrong username and password");
      }
      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken });
    }
  } catch (err) {
    return res.status(401).json("something went wrong");
  }
});

module.exports = router;
