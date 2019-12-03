import request from "supertest";
import dotenv from "dotenv";
import app from "../lib/app";
import mongoose, { mongo } from "mongoose";

dotenv.config();

const databaseURL = `mongodb://127.0.0.1/tvshow_testdb`;

beforeAll(async () => {
  await mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
});

describe("GET /", () => {
  it("should return 200", done => {
    request(app)
      .get("/")
      .expect(200, done);
  });
});

describe("GET /api/", () => {
  it("should return 404 Not Found", done => {
    request(app)
      .get("/api/")
      .expect(404, done);
  });
});

describe("POST /api/tvshow", () => {
  it("should return 401 Unauthorized", done => {
    request(app)
      .get("/api/tvshow/")
      .expect(401, done);
  });

  it("should return 200", done => {
    const token = process.env.ACCESS_TOKEN;
    request(app)
      .post("/api/tvshow/")
      .set("Authorization", "Bearer " + token)
      .expect(401, done);
  });
});

describe("GET /api/tvshow", () => {
  it("should return 401 Unauthorized", done => {
    request(app)
      .get("/api/tvshow/")
      .expect(401, done);
  });

  it("should return 200", () => {
    const token = process.env.ACCESS_TOKEN;
    request(app)
      .get("/api/tvshow/")
      .set("Authorization", "Bearer " + token)
      .expect(200);
  });
});

afterAll(() => {
  mongoose.connection.dropDatabase();
  mongoose.connection.close();
});
