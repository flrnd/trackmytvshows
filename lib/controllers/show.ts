import { Request, Response } from "express";
import { Show, ShowDocument } from "../models/Show";
import e = require("express");

export const getShow = (req: Request, res: Response) => {
  res.status(200).send({ message: "GET show success!" });
};

export const getAllShows = (req: Request, res: Response) => {
  Show.find({})
    .then(shows => res.status(200).send({ message: `TV Shows: ${shows}` }))
    .catch(error => res.status(500).send({ error: error.message }));
};

export const postShow = (req: Request, res: Response) => {
  const newShow = parseShow(req.body);

  newShow
    .save()
    .then(response => {
      console.log(response);
      res.status(200).send({ message: response });
    })
    .catch(error => {
      console.error(error.message);
      res.status(500).send({ error: error.message });
    });
};

const parseShow = (body: any): ShowDocument =>
  new Show({
    title: body.title,
    imdb: body.imdb,
    air: body.air,
    genre: body.genre,
  });
