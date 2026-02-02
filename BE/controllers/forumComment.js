require("dotenv").config();
const { ForumPost, ForumComment, Flag } = require("../models");
const { scanForCrisis } = require("../utils/helper");
const socket = require("../utils/helper");
const EVENTS = require("../../constants/socketEvent");

async function addComment(req, res) {
	try {
		const { content, isAnonymous, displayName } = req.body;
		const user = req.user;
		const postId = req.params.id;

		const post = await ForumPost.findByPk(postId);

		if (!post || post.status !== "visible") {
			return res.status(404).json({ message: "Post not found" });
		}

		if (post.isLocked) {
			return res.status(403).json({
				message: "This thread is locked and cannot receive new comments",
			});
		}

		if (!content) {
			return res.status(400).json({ message: "Content required" });
		}

		const crisisDetected = scanForCrisis(content);

		const comment = await ForumComment.create({
			content,
			postId,
			authorId: user.id,
			status: crisisDetected ? "flagged" : "visible",
			displayName,
			isAnonymous,
		});

		if (crisisDetected) {
			await Flag.create({
				commentId: comment.id,
				flaggedBy: user.id,
				reason: "Crisis keywords detected",
				reviewBatch: comment.currentReviewBatch,
			});
		}

		if (!crisisDetected) {
			const io = socket.getIO();

			io.to(`post-${postId}`).emit(EVENTS.NEW_COMMENT, {
				comment,
			});
		}

		res.status(201).json(comment);
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function updateCommentStatus(req, res) {
	try {
		const { status } = req.body;
		if (!["visible", "hidden", "flagged"].includes(status))
			return res.status(400).json({ message: "Invalid status" });

		const comment = await ForumComment.findByPk(req.params.id);
		if (!comment) return res.status(404).json({ message: "Comment not found" });

		comment.status = status;
		await comment.save();
		return res.status(200).json({
			comment,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

module.exports = {
	addComment,
	updateCommentStatus,
};
