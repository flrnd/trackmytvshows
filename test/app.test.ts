import request from "supertest";
import dotenv from "dotenv";
import app from "../lib/app";
import mongoose from "mongoose";

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
  it("should return 200", () => {
    return request(app)
      .get("/")
      .expect(200);
  });
});

describe("GET /api/", () => {
  it("should return 404 Not Found", () => {
    return request(app)
      .get("/api/")
      .expect(404);
  });
});

describe("POST /api/tvshow", () => {
  it("should return 401 Unauthorized", () => {
    return request(app)
      .get("/api/tvshow/")
      .expect(401);
  });

  it("should return 200", done => {
    const token = process.env.ACCESS_TOKEN;
    return request(app)
      .post("/api/tvshow/")
      .send({ notvalid: "something" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});

describe("GET /api/tvshow", () => {
  it("should return 401 Unauthorized", () => {
    return request(app)
      .get("/api/tvshow/")
      .expect(401);
  });

  it("should return 200", done => {
    const token = process.env.ACCESS_TOKEN;
    return request(app)
      .get("/api/tvshow/")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});

afterAll(async () => {
  mongoose.connection.dropDatabase();
  mongoose.connection.close();
});
