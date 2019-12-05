import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";
import { User } from "../models/User";

const jwtSecret = process.env.JWT_SECRET;

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await check("email", "Email is not valid")
    .isEmail()
    .run(req);
  await check("password", "Password cannot be blank or less than 8 characters")
    .isLength({ min: 8 })
    .run(req);
  await sanitize("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(500).send({ Errors: errors.array() });
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const existingUser = await checkUser(user.email);
    if (!existingUser) {
      return res.status(401).send({ message: "Wrong email." });
    }
    const match = await validateUserPassword(
      user.password,
      existingUser.password,
    );
    if (!match) {
      return res.status(401).send({ auth: false, token: null });
    }
    const token = jwt.sign({ id: existingUser._id }, jwtSecret, {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token });
  } catch (error) {
    console.error(error.message);
  }
};

export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await check("email", "Email is not valid")
    .isEmail()
    .run(req);
  await check("password", "Password cannot be blank")
    .isLength({ min: 8 })
    .run(req);
  await sanitize("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(500).send({ Errors: errors.array() });
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const existingUser = await checkUser(user.email);
    if (existingUser) {
      res.status(500).send({ message: `${user.email} already in use.` });
    }
    const newUser = await user.save();
    res.status(200).send({ message: `Signed in with ${newUser.email}!` });
  } catch (error) {
    console.error(error.message);
  }
};

const validateUserPassword = async (password: string, hash: string) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

const checkUser = async (email: string) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).exec();
  return user;
};
