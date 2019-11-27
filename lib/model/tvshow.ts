import mongoose from "mongoose";

export type TvshowDocument = mongoose.Document & {
  ID: { type: Number; unique: true };
  title: String;
  imdb: String;
  air: Date;
  genre: String;
};
