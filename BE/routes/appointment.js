const express = require("express");
const router = express.Router();

const { authMiddleware, requireRole } = require("../middlewares/auth");
const {
	getAvailableCounsellors,
	getAvailableSlots,
	bookAppointment,
	getMyAppointments,
	getAppointments,
	updateAppointmentStatus,
	confirmAppointmentBooking,
	getAppointmentDetailsByToken,
	getAppointmentStatusByToken,
  cancelAppointment,
} = require("../controllers/appointment");

router.get("/counsellors/available", authMiddleware, getAvailableCounsellors);
router.get("/slots", authMiddleware, getAvailableSlots);
router.post("/", authMiddleware, requireRole("student"), bookAppointment);
router.get("/me", authMiddleware, requireRole("student"), getMyAppointments);
router.get(
	"/counsellors/me",
	authMiddleware,
	requireRole("counsellor", "admin"),
	getAppointments
);
router.patch(
	"/:id/status",
	authMiddleware,
	requireRole("counsellor", "admin"),
	updateAppointmentStatus
);
router.get(
	"/confirm/:qr_token",
	confirmAppointmentBooking
);
router.get(
	"/details/:qr_token",
	getAppointmentDetailsByToken
);
router.get(
	"/status/:token",
	getAppointmentStatusByToken
);

router.put(
	"/cancel/:token",
	authMiddleware,
	requireRole("student"),
	cancelAppointment
);

module.exports = router;
