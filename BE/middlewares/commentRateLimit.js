const { ForumComment } = require("../models");
const { Op } = require("sequelize");

module.exports = async (req, res, next) => {
	const userId = req.user.id;
	const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

	const count = await ForumComment.count({
		where: {
			authorId: userId,
			createdAt: { [Op.gte]: fiveMinutesAgo },
		},
	});

	if (count >= 10) {
		return res.status(429).json({
			message: "Too many comments. Please slow down.",
		});
	}

	next();
};
