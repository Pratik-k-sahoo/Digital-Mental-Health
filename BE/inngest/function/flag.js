const { Flag, ForumPost, ForumComment } = require("../../models");
const { inngest } = require("../client.js");
const { NonRetriableError } = require("inngest");

const flagCommentCreated = inngest.createFunction(
	{ id: "flag-comment-created" },
	{ event: "flag/comment.created" },
	async ({ event, step }) => {
		const { commentId, status, reviewBatch } = event.data;

		const flagCount = await step.run("flag-comment-count", async () =>
			Flag.count({
				where: {
					commentId,
					status,
					reviewBatch,
				},
			}),
		);

		if (flagCount < 3) return;

		await step.run("flag-comment", async () => {
			await ForumComment.update(
				{
					status: "flagged",
					isLocked: true,
					lockReason: "auto_flag",
				},
				{ where: { id: commentId } },
			);
		});
    return { success: true };
	},
);

const flagPostCreated = inngest.createFunction(
	{ id: "flag-post-created" },
	{ event: "flag/post.created" },
	async ({ event, step }) => {
		const { postId, status, reviewBatch } = event.data;

		const flagCount = await step.run("flag-post-count", async () =>
			Flag.count({
				where: {
					postId,
					status,
					reviewBatch,
				},
			}),
		);

		if (flagCount < 3) return;

		await step.run("flag-post", async () => {
			await ForumPost.update(
				{
					status: "flagged",
					isLocked: true,
					lockReason: "auto_flag",
				},
				{ where: { id: postId } },
			);
		});
    return { success: true };
	},
);

module.exports = {
	flagCommentCreated,
	flagPostCreated,
};
