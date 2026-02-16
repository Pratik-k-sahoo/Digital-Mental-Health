const { where } = require("sequelize");
const { PeerApplication, StepResponse } = require("../models");
const { getStepKey } = require("../utils/helper");
const { inngest } = require("../inngest/client");

async function createApplication(req, res) {
	try {
		const application = await PeerApplication.create({
			userId: req.user.id,
			currentStep: 1,
			isDraft: true,
			status: "draft",
		});

		return res.status(201).json({ application });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function getApplication(req, res) {
	try {
		const application = await PeerApplication.findAll({
			where: { userId: req.user.id },
			include: [StepResponse],
		});

		return res.status(200).json({ application: application.reverse()[0] });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function cancelApplication(req, res) {
	try {
		const application = await PeerApplication.findOne({
			where: { id: req.params.id, userId: req.user.id },
			include: [StepResponse],
		});

		application.destroy();

		return res.status(200).json({ message: "Application cancelled" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function saveStep(req, res) {
	try {
		const { id, stepNumber } = req.params;
		const responses = req.body;
		const stepResponse = await StepResponse.upsert({
			applicationId: id,
			stepNumber: parseInt(stepNumber),
			stepKey: getStepKey(stepNumber),
			responses,
			completed: true,
		});

		const application = await PeerApplication.findOne({
			where: { id: req.params.id, userId: req.user.id },
			include: [StepResponse],
		});

		application.currentStep = parseInt(stepNumber) + 1;
		await application.save();

		return res.status(200).json({ application });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function submitApplication(req, res) {
	try {
		const { id } = req.params;
		const application = await PeerApplication.findOne({
			where: { id, userId: req.user.id },
		});

		if (!application)
			return res.status(404).json({ message: "Application not found" });

		const agreementStep = await StepResponse.findOne({
			where: { applicationId: id, stepKey: "agreement" },
		});

		if (!agreementStep)
			return res.status(400).json({ message: "Agreement step missing" });

		await inngest.send({
			name: "peer/application.autoreject",
			data: {
				id,
			},
		});

		const updatedApplication = await PeerApplication.findOne({
			where: { id, userId: req.user.id },
		});

		if (updatedApplication.status === "rejected")
			return res
				.status(200)
				.json({ message: "Application submitted", rejected: true });

		application.isDraft = false;
		application.isSubmitted = true;
		application.status = "submitted";

		await application.save();

		await inngest.send({
			name: "peer/application.submitted",
			data: {
				id,
				userId: req.user.id,
			},
		});

		return res.status(200).json({ message: "Application submitted" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

module.exports = {
	createApplication,
	getApplication,
	saveStep,
	submitApplication,
  cancelApplication
};
