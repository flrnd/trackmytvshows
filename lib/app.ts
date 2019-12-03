import express from "express";
import bodyParser from "body-parser";
import { checkJwt } from "./auth/checkJwt";

import * as tvshowController from "./controllers/show";
import * as helloController from "./controllers/hello";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", helloController.getHello);
app.put("/", helloController.putHello);
app.get("/api/tvshow/", checkJwt, tvshowController.getShow);
app.put("/api/tvshow/", checkJwt, tvshowController.postShow);

export default app;
