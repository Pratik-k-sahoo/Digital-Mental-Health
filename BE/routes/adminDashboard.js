const express = require("express");
const { authMiddleware, requireRole } = require("../middlewares/auth");
const {
	getOveriewStats,
	getAllUsers,
	getAllResources,
	getAllAppointments,
	getAllAssessments,
	getReportedPosts,
	getReportedComments,
	reviewPost,
	reviewReport,
	reviewComment,
	reviewCommentReport,
	getAllPosts,
	fetchAppliedPeers,
	fetchAIAnalysis,
  updatePeerApplicationStatus,
} = require("../controllers/adminDashboard");
const router = express.Router();

router.use(authMiddleware);

router.get("/overview", requireRole("admin"), getOveriewStats);
router.get("/users", requireRole("admin"), getAllUsers);
router.get("/resources", requireRole("admin", "counsellor"), getAllResources);
router.get(
	"/appointments",
	requireRole("admin", "counsellor"),
	getAllAppointments,
);
router.get(
	"/assessments",
	requireRole("admin", "counsellor"),
	getAllAssessments,
);
router.get("/posts", requireRole("admin", "counsellor"), getAllPosts);
router.get(
	"/reported-posts",
	requireRole("admin", "counsellor", "peer_volunteer"),
	getReportedPosts,
);
router.patch(
	"/posts/:id/review",
	requireRole("admin", "counsellor", "peer_volunteer"),
	reviewPost,
);
router.patch(
	"/reported-posts/:id/review",
	requireRole("admin", "counsellor", "peer_volunteer"),
	reviewReport,
);
router.get(
	"/reported-comments",
	requireRole("admin", "counsellor", "peer_volunteer"),
	getReportedComments,
);
router.patch(
	"/comments/:id/review",
	requireRole("admin", "counsellor", "peer_volunteer"),
	reviewComment,
);
router.patch(
	"/reported-comments/:id/review",
	requireRole("admin", "counsellor", "peer_volunteer"),
	reviewCommentReport,
);
router.get(
	"/applied-peers",
	requireRole("admin", "counsellor"),
	fetchAppliedPeers,
);
router.get(
	"/ai-analysis/:id",
	requireRole("admin", "counsellor"),
	fetchAIAnalysis,
);
router.patch(
	"/applied-peer/:id/review/:status",
	requireRole("admin", "counsellor"),
	updatePeerApplicationStatus,
);

module.exports = router;
