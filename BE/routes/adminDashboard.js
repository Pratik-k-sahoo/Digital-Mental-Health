const express = require("express");
const { authMiddleware, requireRole } = require("../middlewares/auth");
const {
	getOveriewStats,
	getAllUsers,
	getAllResources,
	getAllAppointments,
  getAllAssessments,
} = require("../controllers/adminDashboard");
const router = express.Router();

router.use(authMiddleware);

router.get("/overview", requireRole("admin"), getOveriewStats);
router.get("/users", requireRole("admin"), getAllUsers);
router.get("/resources", requireRole("admin"), getAllResources);
router.get(
	"/appointments",
	requireRole("admin", "counsellor"),
	getAllAppointments
);
router.get(
	"/assessments",
	requireRole("admin", "counsellor"),
	getAllAssessments
);

module.exports = router;
