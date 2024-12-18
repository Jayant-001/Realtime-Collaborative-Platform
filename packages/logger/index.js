import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
    format.colorize(),
    format.printf(({ level, message, timestamp, ...meta }) => {
        const metaString = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : "";
        return `${level}: ${timestamp} ==> ${message}${metaString}`;
    })
);

// Create a Winston logger
const logger = createLogger({
    level: "debug",
    format: combine(colorize(), timestamp(), json()),
    transports: [
        new transports.Console({
            format: consoleLogFormat,
        }),
        new transports.File({ filename: "app.log" }),
    ],
});

export default logger;
