import { createLogger, transports } from "winston";

const options = {
  file: {
    level: "info",
    filename: `debug.log`,
    handleExceptions: true,
    json: true,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = createLogger({
  transports: [
    // new winston.transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
});

export default logger;
