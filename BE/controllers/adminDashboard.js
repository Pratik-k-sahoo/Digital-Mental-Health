const { where, Sequelize, Op } = require("sequelize");
const {
	User,
	Resource,
	Appointment,
	Assessment,
	ResourceUsage,
	ForumPost,
	ForumComment,
	Flag,
	PeerApplication,
	StepResponse,
	AIEvaluation,
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
			totalPosts,
			totalComments,
			flaggedPosts,
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
			ForumPost.count(),
			ForumComment.count(),
			ForumPost.count({ where: { status: "flagged" } }),
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
				posts: totalPosts,
				comments: totalComments,
				flaggedPosts,
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
		res.status(200).json({
			message: "Top resources fetched successfully",
			data: data,
		});
	} catch (error) {
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
			attributes: ["type", "score"],
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

		res.status(200).json({
			message: "Users fetched successfully",
			users,
		});
	} catch (error) {
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

async function getAllPosts(req, res) {
	try {
		const posts = await ForumPost.findAndCountAll({
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: User,
					required: true,
				},
			],
		});

		res.status(200).json({
			posts,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function getReportedPosts(req, res) {
	try {
		const posts = await ForumPost.findAll({
			include: [
				{
					model: Flag,
					required: true,
					attributes: ["id", "reason", "status", "reviewBatch", "createdAt"],
					include: [{ model: User, attributes: ["id", "name", "role"] }],
				},
				{ model: User, attributes: ["id", "name"] },
			],
			attributes: {
				include: [
					[
						Sequelize.literal(`(
          SELECT COUNT(*)
          FROM flags
          WHERE flags.postId = ForumPost.id
          AND flags.status = 'pending'
          AND flags.reviewBatch = ForumPost.currentReviewBatch
        )`),
						"flagCount",
					],
				],
			},
			order: [[Sequelize.literal("flagCount"), "DESC"]],
		});

		res.status(200).json({
			message: "Reported Posts fetched successfully.",
			posts,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function reviewPost(req, res) {
	try {
		const { status, isLocked } = req.body;

		if (!["visible", "hidden", "flagged"].includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}

		if (![true, false].includes(isLocked)) {
			return res.status(400).json({ message: "Invalid locking system" });
		}

		const post = await ForumPost.findByPk(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not found" });

		post.status = status;
		post.isLocked = isLocked;
		await post.save();

		return res.status(200).json({
			post,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function reviewReport(req, res) {
	try {
		const post = await ForumPost.findByPk(req.params.id);
		await Flag.update(
			{
				status: "resolved",
			},
			{
				where: {
					postId: req.params.id,
					reviewBatch: post.currentReviewBatch,
					status: "pending",
				},
			},
		);

		post.currentReviewBatch += 1;
		await post.save();

		return res.status(200).json({
			post,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function getReportedComments(req, res) {
	try {
		const comments = await ForumComment.findAll({
			include: [
				{
					model: Flag,
					required: true,
					attributes: ["id", "reason", "status", "reviewBatch", "createdAt"],
					include: [{ model: User, attributes: ["id", "name", "role"] }],
				},
				{ model: User, attributes: ["id", "name"] },
				{
					model: ForumPost,
					attributes: ["id", "title", "category"],
					include: [{ model: User, attributes: ["id", "name", "role"] }],
				},
			],
			attributes: {
				include: [
					[
						Sequelize.literal(`(
              SELECT COUNT(*)
              FROM flags
              WHERE flags.commentId = ForumComment.id
              AND flags.status = 'pending'
              AND flags.reviewBatch = ForumComment.currentReviewBatch
            )`),
						"flagCount",
					],
				],
			},
			order: [[Sequelize.literal("flagCount"), "DESC"]],
		});

		res.status(200).json({
			message: "Reported Comments fetched successfully.",
			comments,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function reviewComment(req, res) {
	try {
		const { status } = req.body;
		console.log(status);
		if (!["visible", "hidden", "flagged"].includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}

		const comment = await ForumComment.findByPk(req.params.id);
		if (!comment) return res.status(404).json({ message: "Comment not found" });

		comment.status = status;
		await comment.save();

		return res.status(200).json({
			comment,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function reviewCommentReport(req, res) {
	try {
		const comment = await ForumComment.findByPk(req.params.id);
		await Flag.update(
			{
				status: "resolved",
			},
			{
				where: {
					commentId: req.params.id,
					reviewBatch: comment.currentReviewBatch,
					status: "pending",
				},
			},
		);

		comment.currentReviewBatch += 1;
		await comment.save();

		return res.status(200).json({
			comment,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function fetchAppliedPeers(req, res) {
	try {
		const applications = await PeerApplication.findAll({
			where: { isSubmitted: true, isDraft: false },
			include: [StepResponse, User],
		});

		return res.status(200).json({
			applications,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function fetchAIAnalysis(req, res) {
	try {
		const aiEvaluationResult = await AIEvaluation.findOne({
			where: { applicationId: req.params.id },
		});

		return res.status(200).json({
			result: aiEvaluationResult,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function updatePeerApplicationStatus(req, res) {
	try {
		const application = await PeerApplication.findOne({
			where: { id: req.params.id },
		});
		const status = req.params.status === "approve";
		if (status) {
			application.status = "approved";
			await application.save();
		} else {
			application.status = "rejected";
			await application.save();
		}

		return res.status(200).json({
			application,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
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
	getAllPosts,
	getReportedPosts,
	reviewPost,
	reviewReport,
	getReportedComments,
	reviewComment,
	reviewCommentReport,
	fetchAppliedPeers,
	fetchAIAnalysis,
	updatePeerApplicationStatus,
};
