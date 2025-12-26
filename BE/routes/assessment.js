const express = require("express");
const { authMiddleware, requireRole } = require("../middlewares/auth");
const {
	assessmentSchema,
	handleValidationResult,
} = require("../middlewares/validate");
const {
	createAssessment,
	getMyAssessments,
	clearAssessments,
} = require("../controllers/assessment");
const { assessmentSeverityStats } = require("../controllers/adminDashboard");
const router = express.Router();

router.post(
	"/create",
	authMiddleware,
	requireRole("student"),
	assessmentSchema,
	handleValidationResult,
	createAssessment
);

router.get(
	"/my-assessments",
	authMiddleware,
	requireRole("student"),
	getMyAssessments
);

// router.delete("/clear/:id", authMiddleware, requireRole("student"));

router.delete(
	"/clear",
	authMiddleware,
	requireRole("student"),
	clearAssessments
);

router.get(
	"/severity",
	authMiddleware,
	requireRole("admin"),
	assessmentSeverityStats
);

module.exports = router;
