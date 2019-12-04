import async, { nextTick } from "async";
import jwt from "express-jwt";
import bcrypt from "bcrypt";

import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";
import { User, UserDocument } from "../models/User";

const secret = { secret: process.env.JWT_SECRET || "Some example secret" };

export const postLogin = async (
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

  User.findOne({ email: user.email.toLowerCase() }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (!existingUser) {
      return res.status(500).send({ message: "wrong email or password." });
    }
    bcrypt.compare(user.password, existingUser.password, (err, isMatch) => {
      if (err) {
        return next(err);
      }
      isMatch
        ? res.status(200).send({ message: "logged in! token: 12345" })
        : res
            .status(401)
            .send({ message: "Unauthorized login. Wrong password." });
    });
  });
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

  User.findOne({ email: user.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(500).send({ message: "User already exists." });
    }
    user.save(err => {
      if (err) {
        return next(err);
      }
    });
    res
      .status(200)
      .send({ message: `Welcome to track my tvshow ${user.email}!` });
  });
};
