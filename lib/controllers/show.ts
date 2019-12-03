import { Request, Response } from "express";

export const getShow = (req: Request, res: Response) => {
  res.status(200).send({ message: "GET show success!" });
};

export const postShow = (req: Request, res: Response) => {
  res.status(200).send({ message: "PUT show success!" });
};
