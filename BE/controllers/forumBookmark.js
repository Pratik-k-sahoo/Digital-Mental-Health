const { where } = require("sequelize");
const { ForumBookmark } = require("../models");
const socket = require("../utils/helper");
const EVENTS = require("../../constants/socketEvent");

async function toggleBookmark(req, res) {
	try {
		const userId = req.user.id;
		const postId = req.params.id;

		const existing = await ForumBookmark.findOne({
			where: { userId, postId },
		});

		let bookmarked;

		if (existing) {
			await existing.destroy();
			bookmarked: false;
		} else {
			await ForumBookmark.create({ userId, postId });
			bookmarked = true;
		}

		const io = socket.getIO();
		io.to(`post-${postId}`).emit(EVENTS.BOOKMARK_TOGGLED, {
			postId,
			userId,
			bookmarked,
		});

		return res.status(201).json({ bookmarked });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

module.exports = {
	toggleBookmark,
};
