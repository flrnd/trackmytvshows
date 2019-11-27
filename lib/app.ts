import express from "express";
import bodyParser from "body-parser";
import Database from "./config/database";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export default app;
