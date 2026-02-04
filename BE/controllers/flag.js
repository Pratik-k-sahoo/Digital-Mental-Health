const { inngest } = require("../inngest/client");
const { Flag, ForumPost, ForumComment } = require("../models");

async function flagPost(req, res) {
	try {
		const { reason } = req.body;

		const existing = await Flag.findOne({
			where: {
				postId: req.params.id,
				flaggedBy: req.user.id,
			},
		});

		if (existing) {
			return res
				.status(400)
				.json({ message: "You already reported this post" });
		}

		const post = await ForumPost.findByPk(req.params.id);

		await Flag.create({
			postId: req.params.id,
			flaggedBy: req.user.id,
			reason,
			reviewBatch: post.currentReviewBatch,
		});

		inngest
			.send({
				name: "flag/post.created",
				data: {
					postId: req.params.id,
					status: "pending",
					reviewBatch: post.currentReviewBatch,
				},
			})
			.catch(console.error);

		res.status(201).json({
			message: "Post reported for review",
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function flagComment(req, res) {
	try {
		const { reason } = req.body;

		const existing = await Flag.findOne({
			where: {
				commentId: req.params.id,
				flaggedBy: req.user.id,
			},
		});

		if (existing) {
			return res
				.status(400)
				.json({ message: "You already reported this comment" });
		}

		const comment = await ForumComment.findByPk(req.params.id);

		await Flag.create({
			commentId: req.params.id,
			flaggedBy: req.user.id,
			reason,
			reviewBatch: comment.currentReviewBatch,
		});

		inngest
			.send({
				name: "flag/comment.created",
				data: {
					commentId: req.params.id,
					status: "pending",
					reviewBatch: comment.currentReviewBatch,
				},
			})
			.catch(console.error);

		res.status(201).json({
			message: "Comment reported for review",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

module.exports = {
	flagPost,
	flagComment,
};
