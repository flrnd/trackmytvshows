import request from "supertest";
import app from "../lib/app";

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
