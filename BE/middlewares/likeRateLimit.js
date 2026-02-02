const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
	windowMs: 10 * 1000,
	max: 20,
	message: "Too many like actions, slow down",
});
