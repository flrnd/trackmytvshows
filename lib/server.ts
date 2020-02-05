import errorHandler from "errorhandler";
import app from "./app";
import Database from "./config/database";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI;
const database = new Database(mongoUrl);
database.connect();
