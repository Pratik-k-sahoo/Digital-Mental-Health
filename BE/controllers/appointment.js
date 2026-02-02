require("dotenv").config();
const { where, Op, include } = require("sequelize");
const { User, Appointment, CounsellorAvail } = require("../models");
const generateTimeSlots = require("../utils/generateTimeSlots");

async function getAvailableCounsellors(req, res) {
	try {
		const counsellors = await User.findAll({
			where: { role: "counsellor" },
		});
		res
			.status(200)
			.json({ message: "Counsellors fetched successfully", counsellors });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function getAvailableSlots(req, res) {
	try {
		const { counsellorId, date } = req.query;
		if (!counsellorId || !date)
			return res
				.status(400)
				.json({ message: "counsellorId and date are required" });

		const daysOfWeek = new Date(date).getDay();
		const availablity = await CounsellorAvail.findAll({
			where: { counsellorId, daysOfWeek, isActive: true },
		});

		if (!availablity.length) return res.status(200).json({ slots: [] });

		const bookedAppointments = await Appointment?.findAll({
			where: {
				counsellorId,
				datetime: {
					[Op.between]: [
						new Date(`${date}T00:00:00`),
						new Date(`${date}T23:59:59`),
					],
				},
				status: "confirmed",
			},
		});

		const bookedTimes = bookedAppointments?.map((app) =>
			app?.dataValues?.datetime?.toISOString()?.substring(11, 16)
		);

		let slots = [];
		availablity?.forEach((slot) => {
			slots?.push(
				...generateTimeSlots(
					slot?.dataValues?.startTime,
					slot?.dataValues?.endTime,
					slot?.dataValues?.slotDuration
				)
			);
		});

		const availableSlots = slots?.filter((slot) => !bookedTimes.includes(slot));

		return res.status(200).json({
			message: "Available slots fetched successfully",
			slots: availableSlots || [],
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function bookAppointment(req, res) {
	try {
		const user = req.user;
		const qrToken = crypto.randomUUID();
		const { counsellorId, date, time, appointmentType } = req.body;

		if (!counsellorId || !date || !time || !appointmentType)
			return res.status(400).json({
				message: "Choose a counsellor, date, time and appointment type to book",
			});

		const [year, month, day] = date.split("-").map(Number);
		const [hour, minute] = time.split(":").map(Number);

		const datetime = new Date(year, month - 1, day, hour + 5, minute + 30);

		const conflictingAppointment = await Appointment.findOne({
			where: {
				counsellorId,
				datetime,
				status: "confirmed",
			},
		});

		if (conflictingAppointment)
			return res.status(409).json({
				message: "Slot already booked. Please choose a different time.",
			});

		const appointment = await Appointment.create({
			studentId: user.id,
			counsellorId,
			datetime,
			status: "pending",
			appointmentType,
			qr_token: qrToken,
			qr_expiresAt: new Date(Date.now() + 5 * 60 * 1000),
		});

		const qrUrl = `${process.env.FRONTEND_URL}/confirm-booking/${qrToken}`;

		return res.status(201).json({
			message: "Appointment booked successfully",
			appointment,
			qrUrl,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function confirmAppointmentBooking(req, res) {
	const appointment = await Appointment.findOne({
		where: { qr_token: req?.params?.qr_token },
	});

	if (!appointment || appointment?.status !== "pending") {
		return res.status(404).json({ message: "Invalid QR Code" });
	}

	if (new Date() > appointment.qr_expiresAt) {
		appointment.status = "expired";
		await appointment.save();
		return res.status(410).json({ message: "QR Code has expired" });
	}

	const conflictingAppointment = await Appointment.findOne({
		where: {
			counsellorId: appointment.counsellorId,
			datetime: appointment.datetime,
			status: "confirmed",
		},
	});

	if (conflictingAppointment)
		return res.status(409).json({
			message: "Slot already booked. Please choose a different time.",
		});

	appointment.status = "confirmed";
	await appointment?.save();

	return res
		.status(200)
		.json({ message: "Appointment confirmed successfully", appointment });
}

async function getAppointmentDetailsByToken(req, res) {
	try {
		const { qr_token } = req.params;

		const appointment = await Appointment.findOne({
			where: {
				qr_token: qr_token,
			},
			include: [
				{ model: User, as: "Counsellor" },
				{ model: User, as: "Student" },
			],
		});
		if (!appointment)
			return res.status(404).json({ message: "Appointment not found" });

		return res.status(200).json({
			message: "Appointment fetched successfully",
			appointment,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function getMyAppointments(req, res) {
	try {
		const user = req.user;
		const appointments = await Appointment.findAll({
			where: {
				studentId: user.id,
				status: {
					[Op.in]: ["completed", "confirmed", "cancelled"],
				},
			},
			include: [{ model: User, as: "Counsellor" }],
			order: [["datetime", "ASC"]],
		});

		return res.status(200).json({
			message: "Appointments fetched successfully",
			appointments,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function getAppointments(req, res) {
	try {
		const user = req.user;
		const appointments = await Appointment.findAll({
			where: { counsellorId: user.id },
			includes: [{ model: User, as: "Student" }],
			order: [["datetime", "ASC"]],
		});

		return res.status(200).json({
			message: "Appointments fetched successfully",
			appointments,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function getAppointmentStatusByToken(req, res) {
	try {
		const { token } = req.params;
		const appointment = await Appointment.findOne({
			where: {
				qr_token: token,
			},
		});
		if (!appointment)
			return res
				.status(404)
				.json({ message: "Appointment not found", status: null });

		return res.status(200).json({
			message: "Appointment status fetched successfully",
			status: appointment.status,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function updateAppointmentStatus(req, res) {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const allowed = ["confirmed", "cancelled", "completed"];

		if (!allowed.includes(status))
			return res.status(400).json({ message: "Invalid status value" });

		const appointment = await Appointment.findByPk(id);
		if (!appointment)
			return res.status(404).json({ message: "Appointment not found" });

		appointment.status = status;
		await appointment.save();

		return res.status(200).json({
			message: "Appointment status updated successfully",
			appointment,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function cancelAppointment(req, res) {
	try {
		const { token } = req.params;
		const appointment = await Appointment.findOne({
			where: {
				qr_token: token,
			},
		});
		if (!appointment)
			return res
				.status(404)
				.json({ message: "Appointment not found", status: null });

		appointment.status = "cancelled";
		await appointment.save();

		return res.status(200).json({
			message: "Appointment cancelled successfully",
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

module.exports = {
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
};
