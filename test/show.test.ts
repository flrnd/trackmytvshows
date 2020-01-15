import mongoose from "mongoose";
import shortid from "shortid";

import { Show, ShowDocument } from "../lib/models/Show";
import dotenv from "dotenv";

dotenv.config();

const showData = {
  title: "Some tv show tittle",
  url: "https://fake/url",
  air: "Monday",
  genre: "scifi",
};

describe("Show model test", () => {
  beforeAll(async () => {
    const databaseURL = process.env.SHOWMODEL_TESTDB_URL;
    await mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("Should create and save a new show", async () => {
    const validShow = new Show(showData);
    const savedShow = await validShow.save();

    expect(savedShow._id).toBeDefined();
    expect(shortid.isValid(savedShow._id)).toBe(true);
    expect(savedShow.title).toBe(showData.title);
    expect(savedShow.url).toBe(showData.url);
    expect(savedShow.air).toBe(showData.air);
    expect(savedShow.genre).toBe(showData.genre);
  });

  it("Should fail when creating a show without title", async () => {
    let capturedError: Error;
    const showWithoutTitleField = new Show({
      title: "",
      imdb: "https://some/fake/url",
    });
    await expect(showWithoutTitleField.save()).rejects.toBeInstanceOf(
      mongoose.Error.ValidationError,
    );
  });

  it("Should return a show with only a title", async () => {
    const showWithOnlyTitle = new Show({
      title: "Some tv show name",
      imdb: "",
    });
    let savedShowWithOnlyTitle: ShowDocument;
    let capturedError: Error;
    try {
      savedShowWithOnlyTitle = await showWithOnlyTitle.save();
    } catch (error) {
      capturedError = error;
      expect(capturedError).toBeInstanceOf(mongoose.Error.ValidationError);
    }
    expect(savedShowWithOnlyTitle._id).toBeDefined();
    expect(savedShowWithOnlyTitle.url).toEqual(undefined);
  });
});
