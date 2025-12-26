const express = require("express");
const { authMiddleware, requireRole } = require("../middlewares/auth");
const {
	getResources,
	createResource,
	updateResource,
	deleteResource,
	resourceStats,
} = require("../controllers/resource");
const { trackUsage } = require("../controllers/resourceUsage");
const {
	resourcesByCategory,
	topResources,
} = require("../controllers/adminDashboard");
const router = express.Router();

router.get("/", authMiddleware, getResources);
router.post(
	"/",
	authMiddleware,
	requireRole("admin", "counsellor"),
	createResource
);
router.patch(
	"/:id",
	authMiddleware,
	requireRole("admin", "counsellor"),
	updateResource
);
router.delete(
	"/:id",
	authMiddleware,
	requireRole("admin", "counsellor"),
	deleteResource
);
router.post("/usage", authMiddleware, trackUsage);
router.get("/stats", authMiddleware, requireRole("admin"), resourceStats);

router.get(
	"/category",
	authMiddleware,
	requireRole("admin"),
	resourcesByCategory
);
router.get("/top", authMiddleware, requireRole("admin"), topResources);

module.exports = router;
