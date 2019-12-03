import request from "supertest";
import app from "../lib/app";
import Database from "../lib/config/database";

const databaseURL = `mongodb://127.0.0.1/test`;
const database = new Database(databaseURL);
let token: { type: string };

beforeAll(() => {
  database.connect();
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

describe("Controllers", () => {
  describe("showController", () => {
    beforeAll(done => {
      database.dropDatabase();
      return done();
    });
  });

  it("should return 500 Error", done => {
    const badRequest = { value: "Some value" };
    request(app)
      .post("/api/tvshow/")
      .send(badRequest)
      .expect(500, done);
  });
});
