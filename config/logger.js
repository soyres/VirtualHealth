import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
    level: 'error',  // Log only errors and higher
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),  // Logs will be output to the console
        new winston.transports.File({ filename: 'error.log', level: 'error' })  // Save error logs to a file
    ],
});

export default logger;
