import mongoose, { Document, Schema } from "mongoose";
import shortid from "shortid";

export type ShowDocument = Document & {
  title: string;
  url: string;
  air: string;
  genre: string;
};

const ShowSchema: Schema = new Schema(
  {
    _id: { type: String, default: shortid.generate },
    title: { type: String, unique: true, required: true },
    url: String,
    air: String,
    genre: String,
  },
  { timestamps: true },
);

export const Show = mongoose.model<ShowDocument>("Show", ShowSchema);
