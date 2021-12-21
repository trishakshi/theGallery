require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Auth = require("../middleware/Auth");

router.get("/", Auth, async (req, res) => {
  try {
    const loggedUser = await User.find();
    res.json(loggedUser);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/loggedUser", Auth, async (req, res) => {
  try {
    const loggedUser = await User.findOne({ _id: req.user });
    res.json(loggedUser);
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, name, password, passwordVerify } = req.body;

    if (!email || !name || !password || !passwordVerify) {
      return res.status(400).json({ err: "Incomplete user data." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ err: "Password must be at least six characters long." });
    }

    if (passwordVerify !== password) {
      return res
        .status(400)
        .json({ err: "Re-enter password for verification." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ err: "Account already exists." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      name,
      avatar: "",
      passwordHash,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? "false"
            : process.env.NODE_ENV === "production" && "true",
      })
      .send();
  } catch (err) {
    return res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ err: "Incomplete user data." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ err: "Incorrect username or password." });
    }

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!correctPassword) {
      return res.status(400).json({ err: "Incorrect email or password." });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? "false"
            : process.env.NODE_ENV === "production" && "true",
      })
      .send();
  } catch (err) {
    return res.status(500).send();
  }
});

router.get("/log_in", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json(null);
    }

    const validatedUser = jwt.verify(token, process.env.JWT_SECRET);

    res.json(validatedUser.id);
  } catch (err) {
    return res.json(null);
  }
});

router.get("/log_out", async (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? "false"
            : process.env.NODE_ENV === "production" && "true",
        expires: new Date(0),
      })
      .send();
  } catch (err) {
    return res.json(null);
  }
});

router.put("/update", Auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    const loggedUser = await User.findOne({ _id: req.user });

    loggedUser.avatar = avatar;
    const updatedUserInfo = await loggedUser.save();
    res.json(updatedUserInfo);
  } catch (err) {
    return res.status(500).send();
  }
});

module.exports = router;
