import express from "express";
import bodyParser from "body-parser";
import { checkJwt } from "./auth/checkJwt";
import { unauthorizedErrorHandler } from "./auth/error";

import * as tvshowController from "./controllers/show";
import * as helloController from "./controllers/hello";
import * as userController from "./controllers/user";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", helloController.getHello);
app.post("/", helloController.putHello);
app.post("/api/signup/", userController.postSignup);
app.post("/api/login/", userController.postLogin);
app.get("/api/tvshow/", checkJwt, tvshowController.getAllShows);
app.post("/api/tvshow/", checkJwt, tvshowController.postShow);

app.use(unauthorizedErrorHandler);

export default app;
