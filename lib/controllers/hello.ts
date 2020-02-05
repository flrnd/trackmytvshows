import { Request, Response } from "express";

export const getHello = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello from Track my TV Shows!",
  });
};

export const postHello = (req: Request, res: Response) => {
  req.body.name
    ? res.status(200).json({ message: `Hello ${req.body.name}!` })
    : res.status(200).json({ message: "Hello stranger!" });
};
