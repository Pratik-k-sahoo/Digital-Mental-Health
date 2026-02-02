const jwt = require("jsonwebtoken");
const cookie = require("cookie");

module.exports = (socket, next) => {
	try {
		const cookies = socket.handshake.headers.cookie;

		if (!cookies) {
			return next(new Error("Cookies Authentication required"));
		}

		const parsedCookies = cookie.parse(cookies);
		const token = parsedCookies.token;

    if (!token) {
			return next(new Error("Token Authentication required"));
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		socket.user = decoded;
		next();
	} catch (error) {
		next(new Error("Invalid token"));
	}
};
