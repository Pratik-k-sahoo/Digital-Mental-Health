const { where } = require("sequelize");
const { ForumLike } = require("../models");
const socket = require("../utils/helper");
const EVENTS = require("../../constants/socketEvent");

async function toggleLike(req, res) {
	try {
		const userId = req.user.id;
		const postId = req.params.id;

		const existing = await ForumLike.findOne({
			where: { userId, postId },
		});

		let liked;

		if (existing) {
			await existing.destroy();
			liked = false;
		} else {
			await ForumLike.create({ userId, postId });
			liked = true;
		}

		const likeCount = await ForumLike.count({
			where: { postId },
		});

		const io = socket.getIO();
		io.to(`post-${postId}`).emit(EVENTS.POST_LIKED, {
			postId,
			likes: likeCount,
			userId,
			liked,
		});

		return res.status(201).json({
			liked,
			likes: likeCount,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

module.exports = {
	toggleLike,
};
