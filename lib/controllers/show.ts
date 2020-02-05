import { Request, Response } from "express";
import { Show, ShowDocument } from "../models/Show";
import logger from "../config/winston";

export const getShow = async (req: Request, res: Response) => {
  try {
    const showID = req.params.showID;
    const show = await Show.findById(showID);
    res.status(200).send({ tvshow: show });
  } catch (error) {
    logger.info(error);
    res.status(404).send({ error: "Not found" });
  }
};

export const getAllShows = async (req: Request, res: Response) => {
  try {
    const shows = await Show.find({});
    res.status(200).send({ tvshows: shows });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const postShow = async (req: Request, res: Response) => {
  try {
    const newShow = parseShow(req.body);
    const savedShow = await newShow.save();
    res.status(200).send({ tvshow: savedShow });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const putShow = async (req: Request, res: Response) => {
  try {
    const showID = req.params.showID;
    const currentShow = await Show.findById(showID);
    const updatedShow = updateShow(currentShow, req.body);
    const response = await updatedShow.save();
    res.status(200).send({ tvshow: response });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const deleteShow = async (req: Request, res: Response) => {
  const showID = req.params.showID;

  try {
    await Show.findByIdAndDelete(showID);
    res.status(204).send();
  } catch (err) {
    res.status(500).send({ error: err.message });
    return;
  }
};

const updateShow = (current: ShowDocument, updatedShow: any): ShowDocument => {
  [current.title, current.genre, current.air, current.url] = updatedShow;

  return current;
};

const parseShow = (body: any): ShowDocument =>
  new Show({
    title: body.title,
    url: body.url,
    air: body.air,
    genre: body.genre,
  });
