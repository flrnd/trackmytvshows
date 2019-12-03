import mongoose, { Document, Schema } from "mongoose";

const ValidationError = mongoose.Error.ValidationError;
const ValidatorError = mongoose.Error.ValidatorError;

export type ShowDocument = Document & {
  title: string;
  imdb: string;
  air: Date;
  genre: string;
};

const ShowSchema: Schema = new Schema(
  {
    title: { type: String, unique: true, required: true },
    imdb: { type: String, required: true },
    air: Date,
    genre: String,
  },
  { timestamps: true },
);

export const Show = mongoose.model<ShowDocument>("Show", ShowSchema);
