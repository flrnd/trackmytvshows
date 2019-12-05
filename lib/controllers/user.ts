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
  try {
    await validateEmailPassword(req);
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    const existingUser = await findUser(user.email);
    if (!existingUser) {
      throw new Error("Wrong email.");
    }
    await validateUserPassword(user.password, existingUser.password);
    const token = jwt.sign({ id: existingUser._id }, jwtSecret, {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token });
  } catch (error) {
    //console.error(error.message);
    return res.status(401).send({ error: `Login failed. ${error}` });
  }
};

export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await validateEmailPassword(req);
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    const existingUser = await findUser(user.email);
    if (existingUser) {
      throw new Error(`${user.email} already in use.`);
    }
    const newUser = await user.save();
    res.status(200).send({ message: `Signed in with ${newUser.email}!` });
  } catch (error) {
    return res.status(403).send({ error: `Signup failed. ${error}` });
  }
};

const validateUserPassword = async (password: string, hash: string) => {
  const match = await bcrypt.compare(password, hash);
  if (!match) throw new Error("Password doesn't match.");
  return match;
};

const findUser = async (email: string) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).exec();
  return user;
};

async function validateEmailPassword(req) {
  await check("email", "Email is not valid")
    .isEmail()
    .run(req);
  await check("password", "Password cannot be blank or less than 8 characters.")
    .isLength({ min: 8 })
    .run(req);
  await sanitize("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new Error(`Validation Error: ${errors.array()}`);
  return errors;
}
