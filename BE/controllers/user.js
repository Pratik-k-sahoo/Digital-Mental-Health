require("dotenv").config();
const bcrypt = require("bcryptjs");
const { User, AlertThreshold, Assessment, Appointment } = require("../models");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");

async function register(req, res) {
	try {
		console.log(req.body);
		const { name, email, password, role, department, year } = req.body;
		const passwordHashed = await bcrypt.hash(password, 16);

		const user = await User.create({
			name,
			email,
			password: passwordHashed,
			role,
			department: department || "",
			year: year - 4 || new Date().getFullYear(),
		});

		if (!user)
			return res.status(401).json({
				message: "Something went wrong. User couldn't be created.",
			});

		const threshold = await AlertThreshold.findOne({
			where: {
				userId: user?.id,
			},
		});

		let assessments = 0,
			appointments = 0;

		if (user?.role === "student") {
			assessments = await Assessment.count({
				where: { userId: user?.id },
			});
			appointments = await Appointment.count({
				where: { studentId: user?.id },
			});
		} else if (user?.role === "counsellor") {
			assessments = await Assessment.count({
				where: { counsellorId: user?.id },
			});
		}

		const userJSON = { ...user.toJSON(), threshold, assessments, appointments };

		const payload = {
			...userJSON,
			password: "",
			updatedTimestamp: "",
		};
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return res
			.status(201)
			.cookie("token", token, {
				maxAge: 1 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: true,
				sameSite: "none",
			})
			.json({
				user: userJSON,
				message: "User created successfully.",
			});
	} catch (error) {
		console.error(error?.errors?.[0]?.message || error?.message || error);
		return res.status(500).json({
			error: error?.errors?.[0]?.message || error?.message || error,
		});
	}
}

async function login(req, res) {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user)
			return res.status(401).json({
				message: "Invalid email or password",
			});

		const isMatched = await user.checkPassword(password);

		if (!isMatched)
			return res.status(401).json({
				message: "Invalid email or password",
			});

		const threshold = await AlertThreshold.findOne({
			where: {
				userId: user?.id,
			},
		});

		let assessments = 0,
			appointments = 0;

		if (user?.role === "student") {
			assessments = await Assessment.count({
				where: { userId: user?.id },
			});
			appointments = await Appointment.count({
				where: { studentId: user?.id },
			});
		} else if (user?.role === "counsellor") {
			assessments = await Assessment.count({
				where: { counsellorId: user?.id },
			});
		}

		const userJSON = { ...user.toJSON(), threshold, assessments, appointments };
		const payload = {
			...userJSON,
			password: "",
			updatedTimestamp: "",
		};
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		return res
			.status(201)
			.cookie("token", token, {
				maxAge: 1 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: true,
				sameSite: "none",
			})
			.json({
				user: userJSON,
				message: "User logged-in successfully.",
			});
	} catch (error) {
		console.error(error?.errors?.[0]?.message || error?.message || error);
		return res.status(500).json({
			error: error?.errors?.[0]?.message || error?.message || error,
		});
	}
}

async function logout(req, res) {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		return res.status(200).json({
			message: "Logged out successfully",
		});
	} catch (error) {
		return res.status(500).json({
			error: error?.errors?.[0]?.message || error?.message || error,
		});
	}
}

async function getMe(req, res) {
	try {
		const user = req.user;
		const me = await User.findOne({
			where: {
				email: user?.email,
			},
		});

		if (!me) {
			return res.status(404).json({
				message: "User not found.",
				user: false,
			});
		}

		res.status(200).json({
			message: "Welcome Back 👏👏",
			user: me,
		});
	} catch (error) {
		return res.status(500).json({
			error: error?.errors?.[0]?.message || error?.message || error,
		});
	}
}

async function updateAlertThreshold(req, res) {
	try {
		const user = req.user;
		const threshold = await AlertThreshold.findByPk(user?.threshold?.id);

		if (!threshold) {
			return res.status(404).json({
				message: "Threshold not found.",
				user: false,
			});
		}

		const payload = {
			pendingAppointments: Number(req.body.pendingAppointments),
			severeAssessments: Number(req.body.severeAssessments),
			moderateSevereAssessments: Number(req.body.moderateSevereAssessments),
			avgPHQ9Score: Number(req.body.avgPHQ9Score),
			avgGAD7Score: Number(req.body.avgGAD7Score),

			enablePendingAppointments: Boolean(req.body.enablePendingAppointments),
			enableSevereAssessments: Boolean(req.body.enableSevereAssessments),
			enableModerateSevereAssessments: Boolean(
				req.body.enableModerateSevereAssessments
			),
			enableAvgPHQ9Score: Boolean(req.body.enableAvgPHQ9Score),
			enableAvgGAD7Score: Boolean(req.body.enableAvgGAD7Score),
		};

		Object.keys(payload).forEach((key) => {
			if (Number.isNaN(payload[key])) delete payload[key];
		});

		await threshold.update(payload);

		const userJSON = { ...user, threshold };

		res.status(200).json({
			message: "Alert threshold updated",
			user: userJSON,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error?.errors?.[0]?.message || error?.message || error,
		});
	}
}

module.exports = {
	register,
	login,
	logout,
	getMe,
	updateAlertThreshold,
};
