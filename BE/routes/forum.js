const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middlewares/auth");
const {
	listPosts,
	createPost,
	getPostWithComments,
	updatePostStatus,
	toggleLock,
  editPost,
} = require("../controllers/forumPost");
const {
	addComment,
	updateCommentStatus,
} = require("../controllers/forumComment");
const { flagPost, flagComment } = require("../controllers/flag");
const rateLimitFlags = require("../middlewares/rateLimitFlags");
const commentRateLimit = require("../middlewares/commentRateLimit");
const { toggleLike } = require("../controllers/forumLike");
const { toggleBookmark } = require("../controllers/forumBookmark");
const likeRateLimit = require("../middlewares/likeRateLimit");

router.get("/posts", authMiddleware, listPosts);
router.post("/post", authMiddleware, createPost);
router.patch("/post/:id", authMiddleware, editPost);
router.get("/posts/:id", authMiddleware, getPostWithComments);

router.post("/posts/:id/comment", authMiddleware, commentRateLimit, addComment);

router.post("/posts/:id/flag", authMiddleware, rateLimitFlags, flagPost);
router.post("/comments/:id/flag", authMiddleware, rateLimitFlags, flagComment);

router.patch(
	"/posts/:id/status",
	authMiddleware,
	requireRole("admin", "counsellor", "peer_volunteer"),
	updatePostStatus,
);

router.patch(
	"/posts/:id/lock/:status",
	authMiddleware,
	requireRole("admin", "counsellor", "peer_volunteer"),
	toggleLock,
);

router.patch(
	"/comments/:id/status",
	authMiddleware,
	requireRole("admin", "counsellor", "peer_volunteer"),
	updateCommentStatus,
);

router.post("/posts/:id/like", authMiddleware, likeRateLimit, toggleLike);
router.post("/posts/:id/bookmark", authMiddleware, toggleBookmark);

module.exports = router;
