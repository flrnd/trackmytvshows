import { Request, Response } from "express";
import { Show, ShowDocument } from "../models/Show";

export const getShow = (req: Request, res: Response) => {
  const showID = req.params.showID;
  Show.findById(showID)
    .then(show =>
      show
        ? res.status(200).send({ tvshow: show })
        : res.status(404).send({ tvshow: "Not found." }),
    )
    .catch(error => res.status(500).send({ error: error }));
};

export const getAllShows = (req: Request, res: Response) => {
  Show.find({})
    .then(shows => res.status(200).send({ tvshows: shows }))
    .catch(error => res.status(500).send({ error: error.message }));
};

export const postShow = (req: Request, res: Response) => {
  const newShow = parseShow(req.body);
  newShow
    .save()
    .then(response => {
      res.status(200).send({ tvshow: response });
    })
    .catch(error => {
      res.status(500).send({ error: error.message });
    });
};

const parseShow = (body: any): ShowDocument =>
  new Show({
    title: body.title,
    url: body.url,
    air: body.air,
    genre: body.genre,
  });
