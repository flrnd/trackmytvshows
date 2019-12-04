import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const jwtSecret = process.env.JWT_SECRET;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers["authorization"];
  const token = parseToken(bearer);
  if (!token) {
    return res
      .status(403)
      .send({ auth: false, message: "No auth token provided." });
  }
  try {
    jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    console.error(`Error: Can't verify token: ${error.message}`);
    return res
      .status(403)
      .send({ auth: false, error: `Can't verify token: ${error.message}` });
  }
};

const parseToken = (token: string): string => {
  return token.slice(7, token.length).trimLeft();
};
