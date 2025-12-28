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
			appointments = await Appointment.count({
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

		const payload = {};

		Object.entries(req.body).forEach(([key, value]) => {
			if (value === undefined) return;

			if (typeof value === "string" && value.trim() != "" && !isNaN(value))
				payload[key] = Number(value);
			else payload[key] = value;
		});

		if (Object.keys(payload).length === 0)
			return res.status(200).json({
				message: "No changes detected",
				user: { ...user, threshold },
			});

		await threshold.update(payload);

		res.status(200).json({
			message: "Alert threshold updated",
			user: { ...user, threshold },
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error?.errors?.[0]?.message || error?.message || error,
		});
	}
}

async function updateUserDetails(req, res) {
	try {
		const user = await User.findByPk(req.user.id);
		if (!user) {
			return res.status(404).json({
				message: "User not found.",
			});
		}

		const payload = {};
		const changes = {};

		if (
			typeof req.body.name === "string" &&
			req.body.name.trim() !== "" &&
			req.body.name != user.name
		) {
			payload.name = req.body.name.trim();
			changes.name = { from: user.name, to: payload.name };
		}

		if (
			req.body.department !== undefined &&
			req.body.department.trim() !== "" &&
			req.body.department != user.department
		) {
			payload.department = req.body.department.trim();
			changes.department = { from: user.department, to: payload.department };
		}

		if (req.body.year !== undefined && Number(req.body.year) !== user.year) {
			payload.year = Number(req.body.year);
			changes.year = { from: user.year, to: payload.year };
		}

		if (req.body.newPassword) {
			console.log("Updating password");
			if (!req.body.currentPassword) {
				return res.status(400).json({
					message: "Current password is required to change password",
				});
			}

			const isMatch = await bcrypt.compare(
				req.body.currentPassword,
				user.password
			);

			if (!isMatch) {
				return res.status(401).json({
					message: "Current password is incorrect",
				});
			}

			if (req.body.newPassword.length < 8) {
				return res.status(400).json({
					message: "New password must be at least 8 characters",
				});
			}

			const hashed = await bcrypt.hash(req.body.newPassword, 10);
			payload.password = hashed;
			changes.password = "updated";
		}

		if (Object.keys(payload).length === 0) {
			return res.status(200).json({
				message: "No changes detected",
				user: { ...user },
			});
		}

		await user.update(payload);

		res.status(200).json({
			message: "Profile updated successfully",
			user: { ...payload },
			changes,
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
	updateUserDetails,
};
