import express from "express";
import bodyParser from "body-parser";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

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
  res.json({
    message: "Hello from Track my TV Shows!",
  });
});

app.get("/api/", checkJwt, (req, res) => {
  res.json({ message: "Hello from private endpoint!" });
});
export default app;
