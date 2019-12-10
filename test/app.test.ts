import request from "supertest";
import dotenv from "dotenv";
import app from "../lib/app";
import mongoose from "mongoose";
import { User, UserDocument } from "../lib/models/User";

dotenv.config();
let testUser: UserDocument;
let token: string;
const testUserData = {
  email: "test@email.com",
  password: "A very secure password",
};

beforeAll(async () => {
  const databaseURL = process.env.MONGODB_TEST_URL;
  await mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  testUser = new User(testUserData);
  testUser.save().then(res => console.info(`Test user created.`));
  setTimeout(() => {
    request(app)
      .post("/api/login")
      .send(testUserData)
      .end((_err, res) => {
        const result = JSON.parse(res.text);
        token = result.token;
      });
  }, 100);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
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

describe("POST /api/signup/", () => {
  it("should return 403 Forbiden: wrong email and password", done => {
    return request(app)
      .post("/api/signup")
      .send({ email: "Jhon", password: "" })
      .expect(403, done);
  });

  it("should return 403 Forbiden: password < 8", done => {
    return request(app)
      .post("/api/signup")
      .send({ email: "Jhon@email.com", password: "123456" })
      .expect(403, done);
  });

  it("should return 200", done => {
    return request(app)
      .post("/api/signup")
      .send({ email: "Jhon@email.com", password: "123456677" })
      .expect(200, done);
  });
  it("should return 403 Forbiden: email already signed", done => {
    return request(app)
      .post("/api/signup")
      .send({ email: "Jhon@email.com", password: "123231311" })
      .expect(403, done);
  });
});

describe("POST /api/login/", () => {
  it("should return 401 Unathorized: wrong email & password", done => {
    return request(app)
      .post("/api/login")
      .send({ email: "Jhon", password: "" })
      .expect(401, done);
  });

  it("should return 401 Unathorized: wrong password < 8", done => {
    return request(app)
      .post("/api/login")
      .send({ email: "Jhon@email.com", password: "123456" })
      .expect(401, done);
  });

  it("should return 401 Unathorized", done => {
    return request(app)
      .post("/api/login")
      .send({ email: "Jhon@email.com", password: "123456999" })
      .expect(401, done);
  });

  it("should return 200 Ok and a token in a JSON object", done => {
    return request(app)
      .post("/api/login")
      .send(testUserData)
      .expect(200)
      .end((_err, res) => {
        const result = JSON.parse(res.text);
        expect(result.hasOwnProperty("auth")).toBe(true);
        expect(result.auth).toBe(true);
        expect(result.hasOwnProperty("token")).toBe(true);
        done();
      });
  });
});

describe("POST /api/tvshow/", () => {
  it("should return 403 Forbiden", done => {
    return request(app)
      .get("/api/tvshow")
      .expect(403, done);
  });

  it("should return 500 validation failed", done => {
    return request(app)
      .post("/api/tvshow")
      .send({ notvalid: "something" })
      .set("Authorization", `Bearer ${token}`)
      .expect(500, done);
  });

  it("should return 200 when create a new show and return a json object", done => {
    return request(app)
      .post("/api/tvshow")
      .send({ title: "A tv show", imdb: "http://someurl" })
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).toBe(200);
        const result = JSON.parse(res.text);
        expect(result.hasOwnProperty("tvshow")).toBe(true);
        done();
      });
  });
});

describe("GET /api/tvshow/", () => {
  it("should return 403 Forbiden", () => {
    return request(app)
      .get("/api/tvshow")
      .expect(403);
  });

  it("should return 200", done => {
    return request(app)
      .get("/api/tvshow")
      .set("Authorization", `Bearer ${token}`)
      .expect(200, done);
  });
});

describe("GET /api/tvshow/{id}/", () => {
  it("should return a 404 Not found.", done => {
    const id = "somerandombadID";
    return request(app)
      .get(`/api/tvshow/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).toBe(404);
        done();
      });
  });
});
