import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const jwtSecret = process.env.JWT_SECRET;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bearer = req.headers["authorization"];
    if (!checkBearer(bearer))
      throw new Error("Format-> Authorization: Bearer [token]");
    const token = parseToken(bearer);
    if (!token) {
      return res
        .status(403)
        .send({ auth: false, message: "No auth token provided." });
    }
    jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    console.error(`Error: Can't verify token: ${error.message}`);
    return res
      .status(403)
      .send({ auth: false, error: `Can't verify token: ${error.message}` });
  }
};

const checkBearer = (token: string): boolean => {
  return token !== undefined && token.startsWith("Bearer ");
};
const parseToken = (token: string): string => {
  return token.slice(7, token.length).trimLeft();
};
