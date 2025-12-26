require("dotenv").config();
const { Assessment } = require("../models");
const {
	calculatePHQ9Score,
	calculateGAD7Score,
} = require("../utils/assessmentScoring");

async function createAssessment(req, res) {
	try {
		const user = req.user;
		const { type, answers } = req.body;

		let result;
		if (type === "PHQ9") {
			if (answers.length !== 9)
				return res.status(400).json({ message: "PHQ9 requires 9 answers" });
			result = calculatePHQ9Score(answers);
		} else if (type === "GAD7") {
			if (answers.length !== 7)
				return res.status(400).json({ message: "GAD7 requires 7 answers" });
			result = calculateGAD7Score(answers);
		} else {
			return res.status(400).json({ message: "Unsupported assessment type" });
		}

		const assessment = await Assessment.create({
			userId: user.id,
			type,
			answers,
			score: result.score,
			severity: result.severity,
		});

		return res.status(201).json({
			message: "Assessment saved successfully",
			assessment,
		});
	} catch (error) {
		console.error("Error creating assessment:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

async function getMyAssessments(req, res) {
	try {
		const user = req.user;
		const assessments = await Assessment.findAll({
			where: { userId: user.id, isDeleted: false },
			order: [["createdAt", "DESC"]],
		});

		return res.status(200).json({
			message: "Assessments retrieved successfully",
			assessments,
		});
	} catch (error) {
		console.error("Error retrieving assessments:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

async function clearAssessments(req, res) {
	try {
		const user = req.user;
		await Assessment.update(
			{ isDeleted: true },
			{
				where: { userId: user.id, isDeleted: false },
			}
		);

		return res.status(200).json({
			message: "Assessments history cleared successfully",
		});
	} catch (error) {
		console.error("Error retrieving assessments:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

module.exports = {
	createAssessment,
	getMyAssessments,
	clearAssessments,
};
