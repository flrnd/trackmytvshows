import mongoose, { Document, Schema } from "mongoose";

export type ShowDocument = Document & {
  title: string;
  url: string;
  air: string;
  genre: string;
};

const ShowSchema: Schema = new Schema(
  {
    title: { type: String, unique: true, required: true },
    url: String,
    air: String,
    genre: String,
  },
  { timestamps: true },
);

export const Show = mongoose.model<ShowDocument>("Show", ShowSchema);
