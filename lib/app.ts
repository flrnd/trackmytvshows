import express from "express";
import bodyParser from "body-parser";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

import * as tvshowController from "./controllers/show";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Auth
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});

// routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from Track my TV Shows!",
  });
});

app.put("/", (req, res) => {
  res.status(200).json({ message: `Hello ${req.body.name}` });
});

app.get("/api/tvshow/", checkJwt, tvshowController.getShow);
app.post("/api/tvshow/", checkJwt, tvshowController.postShow);

export default app;
