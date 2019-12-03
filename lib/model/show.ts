import mongoose from "mongoose";

export type ShowDocument = mongoose.Document & {
  ID: { type: Number; unique: true };
  title: String;
  imdb: String;
  air: Date;
  genre: String;
};
