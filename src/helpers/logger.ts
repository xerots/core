import axios from 'axios';
import winston from 'winston';
import { isDebugEnabled } from './index';

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// This method set the current severity based on
// the current APP_DEBUG env.
// If true, then it will show all the logs,
// otherwise, will show warning and error logs.
const level = () => {
  return isDebugEnabled() ? 'debug' : 'warn';
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors);

// Chose the aspect of your log customizing the log format.
const consoleFormat = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console({
    format: consoleFormat,
  }),
  // Allow printing all the error level messages inside the error.log file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format,
  }),
  // Allow printing all the error message inside the all.log file
  // (also the error log that is also printed inside the error.log(
  new winston.transports.File({ filename: 'logs/all.log', format }),
];

// Create the logger instance that has to be exported
// and used to log messages.
interface WinstonLogger extends winston.Logger {
  inspect: (error: Error) => void;
}
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
}) as WinstonLogger;

logger.inspect = (error: Error) => {
  if (axios.isAxiosError(error) && error.response) {
    error.message = JSON.stringify({
      url: error.response.config.url,
      status: error.response.status,
      data: error.response.data,
    });
  }
  return logger.debug(`${error.name} - ${error.message}\nStacktrace:\n${error.stack}`);
};

export { logger };
