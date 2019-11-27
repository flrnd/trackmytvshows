import mongoose from "mongoose";
import bluebird from "bluebird";

export default class Database {
  private mongoUrl: string;

  constructor(url: string) {
    this.mongoUrl = url;
    this.config();
  }

  private config() {
    mongoose.Promise = bluebird;
  }

  public connect() {
    mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        return console.info(`MongoDB connection: success`);
      })
      .catch(error => {
        console.error(
          `MongoDB connection error. Please make sure MongoDB is running. ${error}`,
        );
        return process.exit(1);
      });
  }
}
