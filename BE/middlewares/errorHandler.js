require("dotenv").config();
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
	logger.error(err);

	const statusCode = err.statusCode || 500;

	const payload = {
		message: err.message || "Internal Server Error",
	};

	if (process.env.NODE_ENV !== "production") {
		(payload.stack = err.stack), (payload.name = err.name);
	}

	res.status(statusCode).json(payload);
};

module.exports = errorHandler;
