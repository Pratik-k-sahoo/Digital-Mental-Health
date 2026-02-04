const { NonRetriableError } = require("inngest");
const { ForumPost, ForumComment, Flag, User } = require("../../models");
const { inngest } = require("../client.js");
const { scanForCrisis } = require("../../utils/helper.js");
const { where } = require("sequelize");

const postCreated = inngest.createFunction(
	{ id: "forum-post-created" },
	{ event: "forum/post.created" },
	async ({ event, step }) => {
		const { postId, authorId } = event.data;

		const post = await step.run("fetch-post", () => ForumPost.findByPk(postId));

		if (!post) return;

		const crisisDetected = await step.run("crisis-scan", async () => {
			return scanForCrisis(post.content) || scanForCrisis(post.title);
		});

		if (!crisisDetected) {
			await step.run("mark-visible", async () => {
				await ForumPost.update(
					{ status: "visible" },
					{
						where: {
							id: postId,
							authorId,
						},
					},
				);
			});
			return;
		}

		await step.run("lock-post", async () => {
			await ForumPost.update(
				{
					status: "flagged",
					isLocked: true,
					lockReason: "crisis_detected",
				},
				{ where: { id: postId } },
			);
		});

		await step.run("create-flag", async () => {
			await Flag.create({
				postId,
				flaggedBy: authorId,
				reason: "Crisis keywords detected",
				reviewBatch: post.currentReviewBatch,
			});
		});
	},
);

const postUpdated = inngest.createFunction(
	{ id: "forum-post-updated" },
	{ event: "forum/post.updated" },
	async ({ event, step }) => {
		const { postId, authorId } = event.data;

		const post = await step.run("fetch-post", () => ForumPost.findByPk(postId));

		if (!post) return;

		const crisisDetected = await step.run("crisis-scan", async () => {
			return scanForCrisis(post.content) || scanForCrisis(post.title);
		});

		if (!crisisDetected) {
			await step.run("mark-visible", async () => {
				await ForumPost.update(
					{ status: "visible" },
					{
						where: {
							id: postId,
							authorId,
						},
					},
				);
			});
			return;
		}

		await step.run("lock-post", async () => {
			await ForumPost.update(
				{
					status: "flagged",
					isLocked: true,
					lockReason: "crisis_detected",
				},
				{ where: { id: postId } },
			);
		});

		await step.run("create-flag", async () => {
			await Flag.create({
				postId,
				flaggedBy: authorId,
				reason: "Crisis keywords detected",
				reviewBatch: post.currentReviewBatch,
			});
		});
	},
);

module.exports = {
	postCreated,
	postUpdated,
};
