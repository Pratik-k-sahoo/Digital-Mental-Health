const { where, Sequelize, Op } = require("sequelize");
const {
	User,
	Resource,
	Appointment,
	Assessment,
	ResourceUsage,
} = require("../models");

async function getOveriewStats(req, res) {
	try {
		const [
			totalUsers,
			totalStudents,
			totalCounsellors,
			totalResources,
			totalAppointments,
			totalPendingAppointments,
			totalConfirmedAppointments,
			totalCompletedAppointments,
			totalAssessments,
		] = await Promise.all([
			User.count(),
			User.count({ where: { role: "student" } }),
			User.count({ where: { role: "counsellor" } }),
			Resource.count({ where: { isActive: true } }),
			Appointment.count(),
			Appointment.count({ where: { status: "pending" } }),
			Appointment.count({ where: { status: "confirmed" } }),
			Appointment.count({ where: { status: "completed" } }),
			Assessment.count(),
		]);

		res.status(200).json({
			message: "Overview stats fetched successfully",
			data: {
				users: totalUsers,
				students: totalStudents,
				counsellors: totalCounsellors,
				resources: totalResources,
				appointments: totalAppointments,
				pendingAppointments: totalPendingAppointments,
				confirmedAppointments: totalConfirmedAppointments,
				completedAppointments: totalCompletedAppointments,
				assessments: totalAssessments,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
}

async function resourcesByCategory(req, res) {
	try {
		const data = await Resource.findAll({
			attributes: [
				"category",
				[Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
			],
			where: { isActive: true },
			group: ["category"],
		});

		res.status(200).json({
			message: "Resources by category fetched successfully",
			data,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
}

async function topResources(req, res) {
	try {
		const { range } = req.query;

		const usageWhere = range ? { createdAt: { [Op.gte]: range } } : {};
		const data = await Resource.findAll({
			attributes: [
				"id",
				"title",
				[
					Sequelize.fn("COUNT", Sequelize.col("ResourceUsages.id")),
					"usageCount",
				],
				[
					Sequelize.fn("MAX", Sequelize.col("ResourceUsages.createdAt")),
					"lastUsedAt",
				],
			],
			include: [
				{
					model: ResourceUsage,
					attributes: [],
					where: usageWhere,
					required: true,
				},
			],
			where: {
				isDeleted: false,
			},
			group: ["Resource.id"],
			order: [[Sequelize.literal("usageCount"), "DESC"]],
			limit: 5,
			subQuery: false,
		});
		console.log(data);
		res.status(200).json({
			message: "Top resources fetched successfully",
			data: data,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
}

async function assessmentSeverityStats(req, res) {
	try {
		const dataBySevere = await Assessment.findAll({
			attributes: [
				"severity",
				[Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
			],
			group: ["severity"],
		});
		const dataByTypes = await Assessment.findAll({
			attributes: [
				"type",
				"score",
			],
		});
		res.status(200).json({
			message: "Assessment severity fetched successfully",
			data: { dataBySevere, dataByTypes },
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
}

async function getAllUsers(req, res) {
	try {
		const users = await User.findAll({
			attributes: {
				exclude: ["password"],
			},
			order: [["createdAt", "DESC"]],
		});

		console.log(users);
		res.status(200).json({
			message: "Users fetched successfully",
			users,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
}

async function getAllResources(req, res) {
	try {
		const resources = await Resource.findAll({
			where: { isDeleted: false },
			order: [["createdAt", "DESC"]],
		});

		res.status(200).json({
			message: "Resources fetched successfully",
			resources,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
}

async function getAllAppointments(req, res) {
	try {
		const { from, to } = req.query;

		const where = {};

		if (from && to) where.datetime = { [Op.between]: [from, to] };

		const appointments = await Appointment.findAll({
			include: [
				{ model: User, as: "Counsellor" },
				{ model: User, as: "Student" },
			],
			order: [
				[
					Sequelize.literal(`
            CASE 
              WHEN datetime >= NOW() THEN 0 
              ELSE 1 END
          `),
					"ASC",
				],
				[
					Sequelize.literal(`
            CASE
              WHEN datetime >= NOW() THEN datetime
            END
          `),
					"ASC",
				],
				[
					Sequelize.literal(`
            CASE
              WHEN datetime < NOW() THEN datetime
            END
          `),
					"DESC",
				],
			],
		});

		res.status(200).json({
			message: "Appointments fetched successfully",
			appointments,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
}

async function getAllAssessments(req, res) {
	try {
		const { from, to, department, year } = req.query;

		const whereAssessment = {};
		const whereUser = {};

		if (from && to) whereAssessment.createdAt = { [Op.between]: [from, to] };
		if (department) whereUser.department = department;
		if (year) whereUser.year = year;

		const assessments = await Assessment.findAll({
			include: [
				{
					model: User,
					attributes: [],
					where: whereUser,
				},
			],
			where: whereAssessment,
		});

		res.status(200).json({
			message: "Assessments fetched successfully",
			assessments,
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
}

module.exports = {
	getOveriewStats,
	resourcesByCategory,
	topResources,
	assessmentSeverityStats,
	getAllUsers,
	getAllResources,
	getAllAppointments,
	getAllAssessments,
};
