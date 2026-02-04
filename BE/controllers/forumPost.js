require("dotenv").config();
const { Sequelize, where } = require("sequelize");
const { ForumPost, ForumComment, Flag, User } = require("../models");
const { scanForCrisis } = require("../utils/helper");
const { inngest } = require("../inngest/client");

async function listPosts(req, res) {
	try {
		const { page = 1, limit = 10 } = req.query;
		const pageNum = Number(page);
		const limitNum = Number(limit);
		const commentWhere =
			req.user?.role === "admin" ||
			req.user?.role === "counsellor" ||
			req.user?.role === "peer_volunteer"
				? {}
				: { status: "visible" };
		const posts = await ForumPost.findAndCountAll({
			where: { status: "visible" },
			order: [["createdAt", "DESC"]],
			limit: limitNum,
			offset: (pageNum - 1) * limitNum,
			include: [
				{ model: User, attributes: ["id", "name"] },
				{
					model: ForumComment,
					where: commentWhere,
					attributes: [],
					required: false,
				},
			],
			attributes: {
				include: [
					[Sequelize.fn("COUNT", Sequelize.col("ForumComments.id")), "replies"],
					[
						Sequelize.literal(`(
SELECT COUNT(*)
FROM forum_likes
WHERE forum_likes.postId = ForumPost.id
)`),
						"likes",
					],
					[
						Sequelize.literal(`(
SELECT COUNT(*)
FROM forum_bookmarks
WHERE forum_bookmarks.postId = ForumPost.id
)`),
						"bookmarks",
					],
					[
						Sequelize.literal(`(
SELECT COUNT(*)
FROM forum_likes
WHERE forum_likes.postId = ForumPost.id
AND forum_likes.userId = ${req.user.id}
)`),
						"liked",
					],
					[
						Sequelize.literal(`(
SELECT COUNT(*)
FROM forum_bookmarks
WHERE forum_bookmarks.postId = ForumPost.id
AND forum_bookmarks.userId = ${req.user.id}
)`),
						"bookmarked",
					],
				],
			},

			group: ["ForumPost.id", "User.id"],
			subQuery: false,
			distinct: true,
		});

		const total = posts.count.length;
		res.status(200).json({
			total,
			pages: Math.ceil(total / limit),
			posts: posts.rows,
			page: pageNum,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function createPost(req, res) {
	try {
		const { title, content, isAnonymous, category, displayName } = req.body;
		const user = req.user;

		if (!title || !content) {
			return res.status(400).json({ message: "Title and content required" });
		}

		const post = await ForumPost.create({
			title,
			content,
			isAnonymous,
			category,
			authorId: user.id,
			status: "under_review",
			displayName,
			isLocked: false,
			lockReason: null,
		});

		inngest
			.send({
				name: "forum/post.created",
				data: {
					postId: post.id,
					authorId: user.id,
				},
			})
			.catch(console.error);

		res.status(201).json({
			post,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function getPostWithComments(req, res) {
	try {
		const commentWhere =
			req.user?.role === "admin" ||
			req.user?.role === "counsellor" ||
			req.user?.role === "peer_volunteer"
				? {}
				: { status: "visible" };
		const post = await ForumPost.findOne({
			where: { id: req.params.id, status: "visible" },
			include: [
				{
					model: ForumComment,
					where: commentWhere,
					required: false,
					order: [["createdAt", "DESC"]],
				},
			],
		});

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json({
			post,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function updatePostStatus(req, res) {
	try {
		const { status } = req.body;

		if (!["visible", "hidden", "flagged"].includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}

		const post = await ForumPost.findByPk(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not found" });

		post.status = status;
		if (status !== "visible") post.isLocked = true;
		await post.save();

		return res.status(200).json({
			post,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function toggleLock(req, res) {
	const post = await ForumPost.findByPk(req.params.id);
	if (!post) return res.status(404).json({ message: "Post not found" });

	post.isLocked = req.params.status;
	await post.save();

	return res.status(200).json({ isLocked: post.isLocked });
}

async function editPost(req, res) {
	try {
		const { title, content, isAnonymous, category, displayName, authorId } =
			req.body;
		const user = req.user;
		const id = req.params.id;

		if (user.id !== authorId) {
			return res
				.status(404)
				.json({ message: "Content can only be edited by the owner." });
		}

		if (!title || !content) {
			return res.status(400).json({ message: "Title and content required" });
		}

		await ForumPost.update(
			{
				title,
				content,
				isAnonymous,
				category,
				authorId: user.id,
				status: "under_review",
				displayName,
			},
			{ where: { authorId, id } },
		);

		inngest
			.send({
				name: "forum/post.updated",
				data: {
					postId: id,
					authorId: user.id,
				},
			})
			.catch(console.error);

		res.status(200).json({
			message: "Post edited successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

module.exports = {
	listPosts,
	createPost,
	getPostWithComments,
	updatePostStatus,
	toggleLock,
	editPost,
};
