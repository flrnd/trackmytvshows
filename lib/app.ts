import express, { Application } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bluebird from "bluebird";

const app = express();
const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI;
mongoose.Promise = bluebird;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch(err => {
    console.error(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`,
    );
    // process.exit();
  });

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export default app;
