import request from "supertest";
import app from "../lib/app";

describe("GET /", () => {
  it("should return 404", done => {
    request(app)
      .get("/")
      .expect(404, done);
  });
});
