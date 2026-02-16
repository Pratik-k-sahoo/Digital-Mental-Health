const express = require("express");
const { authMiddleware, requireRole } = require("../middlewares/auth");
const {
	createApplication,
	getApplication,
	saveStep,
	submitApplication,
  cancelApplication,
} = require("../controllers/volunteer");
const router = express.Router();

router.use(authMiddleware);
router.use(requireRole("student"));

router.post("/", createApplication);
router.get("/:id", getApplication);
router.delete("/:id", cancelApplication);
router.put("/:id/step/:stepNumber", saveStep);
router.post("/:id/submit", submitApplication);

module.exports = router;
