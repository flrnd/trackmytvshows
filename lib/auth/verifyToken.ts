import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const jwtSecret = process.env.JWT_SECRET;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bearer = getBearerFromHeader(req.headers["authorization"]);
    const token = parseToken(bearer);
    jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    //console.error(`Error: Can't verify token: ${error.message}`);
    return res
      .status(403)
      .send({ auth: false, error: `Can't verify token: ${error.message}` });
  }
};

const getBearerFromHeader = (bearer: string): string => {
  if (!checkBearer(bearer)) {
    throw new Error("Missing Bearer [token]");
  }
  return bearer;
};

const checkBearer = (token: string): boolean => {
  return token !== undefined && token.startsWith("Bearer ");
};

const parseToken = (bearer: string): string => {
  const token = bearer.slice(7, bearer.length).trimLeft();
  if (!token) throw new Error("No authorization token provided.");
  return token;
};
