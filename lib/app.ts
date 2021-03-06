import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import { unauthorizedErrorHandler } from "./auth/error";
import { verifyToken } from "./auth/verifyToken";

import * as tvshowController from "./controllers/show";
import * as helloController from "./controllers/hello";
import * as userController from "./controllers/user";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.get("/", helloController.getHello);
app.post("/", helloController.postHello);

// Signup and login
app.post("/api/signup/", userController.postSignup);
app.post("/api/login/", userController.postLogin);

// tvshows
app.get("/api/tvshow/", verifyToken, tvshowController.getAllShows);
app.post("/api/tvshow/", verifyToken, tvshowController.postShow);
app.get("/api/tvshow/:showID", verifyToken, tvshowController.getShow);
app.put("/api/tvshow/:showID", verifyToken, tvshowController.putShow);
app.delete("/api/tvshow/:showID", verifyToken, tvshowController.deleteShow);

app.use(unauthorizedErrorHandler);

export default app;
