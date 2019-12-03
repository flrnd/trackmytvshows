import request from "supertest";
import dotenv from "dotenv";
import app from "../lib/app";
import mongoose, { mongo } from "mongoose";

dotenv.config();

const databaseURL = `mongodb://127.0.0.1/tvshow_testdb`;
const authUrl = "https://dev-0fmeh6qq-flrn.eu.auth0.com";
let token: { type: string };

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

describe("GET /api/tvshow/", () => {
  it("should return 401 Unauthorized", done => {
    request(app)
      .get("/api/tvshow/")
      .expect(401, done);
  });
});

describe("POST /api/tvshow", () => {
  it("should return 401 Unauthorized", done => {
    request(app)
      .post("/api/tvshow/")
      .expect(401, done);
  });
});

//describe("POST /api/tvshow bad Request", () => {
//  it("should return 500 Error", done => {
//    jest.setTimeout(30000);
//    const badRequest = { some: "Value" };
//    const token = process.env.ACCESS_TOKEN;
//    request(app)
//      .post("/api/tvshow/")
//      .set("Authorization", `Bearer ${token}`)
//      .expect(500, done);
//  });
//});

afterAll(async () => {
  mongoose.connection.dropDatabase();
  mongoose.connection.close();
});
