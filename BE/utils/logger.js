require("dotenv").config();
const { createLogger, format, transports } = require("winston");
const path = require("path");

const logger = createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	transports: [
		new transports.File({
			filename: path.join("logs", "error.log"),
			level: "errors",
		}),
		new transports.File({ filename: path.join("logs", "combined.log") }),
	],
});

if (process.env.NODE_ENV !== "production")
	logger.add(
		new transports.Console({
			format: format.combine(format.colorize(), format.simple()),
		})
	);

module.exports = logger;
