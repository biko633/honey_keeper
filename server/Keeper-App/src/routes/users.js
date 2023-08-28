import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();
const PHash = Number(process.env.password_hash);

//REGISTER A USER//
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    return res.json({ message: "Please fill all fields" });
  }
  const user = await UserModel.findOne({ username: username });
  if (user) {
    if (user.username == username) {
      return res.json({ message: "User already exists!" });
    }
  } else {
    const hashedPassword = await bcrypt.hash(password, PHash);
    const newUser = new UserModel({
      username: username,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.secret);
    res.json({ token, userID: newUser._id });
  }
});

//LOGIN A USER//
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    return res.json({ message: "Please fill all fields" });
  }
  const user = await UserModel.findOne({ username: username });
  if (!user) {
    return res.json({ message: "User doesn't exists!" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({ message: "Username or password is incorrect" });
  }
  const token = jwt.sign({ id: user._id }, process.env.secret);
  res.json({ token, userID: user._id });
});

export { router as usersRouter };

// VERIFY A USER //
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.secret, (err) => {
      if (err) {
        console.error(
          "you are not allowed to do this please login or register your account"
        );
        res.json({
          status: 403,
          message:
            "you are not allowed to do this please login or register your account",
        });
      } else {
        next();
      }
    });
  } else {
    console.error(
      "you are not authorized to access this page please login or register your account"
    );
    res.json({
      status: 401,
      message:
        "you are not authorized to access this page please login or register your account",
    });
  }
};
