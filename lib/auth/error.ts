import { NextFunction, Request, Response } from "express";

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const unauthorizedErrorHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error.name === "UnauthorizedError") {
    console.error(`ERROR: ${error}`);
    response.status(401).send({ message: `${error}` });
  }
};
