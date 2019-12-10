import mongoose from "mongoose";
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
    expect(savedShow.title).toBe(showData.title);
    expect(savedShow.url).toBe(showData.url);
    expect(savedShow.air).toBe(showData.air);
    expect(savedShow.genre).toBe(showData.genre);
  });

  it("Should fail when creating a show without title", async () => {
    const showWithoutTitleField = new Show({
      title: "",
      imdb: "https://some/fake/url",
    });
    try {
      await showWithoutTitleField.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  it("Should return a show with only a title", async () => {
    const showWithOnlyTitle = new Show({
      title: "Some tv show name",
      imdb: "",
    });
    let savedShowWithOnlyTitle: ShowDocument;
    try {
      savedShowWithOnlyTitle = await showWithOnlyTitle.save();
    } catch (error) {
      console.error(error);
    }
    expect(savedShowWithOnlyTitle._id).toBeDefined();
  });
});
