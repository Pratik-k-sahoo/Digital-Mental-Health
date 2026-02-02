const express = require("express");
const router = express.Router();
const {
	register,
	login,
	logout,
	getMe,
	updateAlertThreshold,
	updateUserDetails,
  forgetPassword,
} = require("../controllers/user");
const {
	regstrationSchema,
	handleValidationResult,
	loginSchema,
} = require("../middlewares/validate");
const { authMiddleware, requireRole } = require("../middlewares/auth");

router.post("/register", regstrationSchema, handleValidationResult, register);
router.post("/login", loginSchema, handleValidationResult, login);
router.post("/forget", forgetPassword);
router.patch("/update", authMiddleware, updateUserDetails);
router.post("/logout", authMiddleware, logout);
router.get("/auth", authMiddleware, getMe);
router.patch(
	"/threshold",
	authMiddleware,
	requireRole("admin", "counsellor"),
	updateAlertThreshold
);

module.exports = router;
