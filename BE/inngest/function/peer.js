const { where } = require("sequelize");
const { PeerApplication, StepResponse } = require("../../models");
const { inngest } = require("../client.js");
const { NonRetriableError } = require("inngest");
const combineScores = require("../../services/aiAgents/combineScores.js");
const storeEvaluation = require("../../services/aiAgents/storeEvaluation.js");
const runAI = require("../../services/aiAgents/runAI.js");

const peerApplicationAutoReject = inngest.createFunction(
	{ id: "peer-application-auto-reject" },
	{ event: "peer/application.autoreject" },
	async ({ event, step }) => {
		const { id } = event.data;
		const agreementStep = await step.run("fetch-agreement-step", async () =>
			StepResponse.findOne({
				where: { applicationId: id, stepKey: "agreement" },
			}),
		);

		const answers = agreementStep.responses;

		if (
			!answers.trainingConsent ||
			!answers.ruleConsent ||
			!answers.notTherapyAgreement ||
			!answers.moderationConsent
		) {
			const application = await step.run("auto-reject-application", async () =>
				PeerApplication.update(
					{
						status: "rejected",
					},
					{ where: { id } },
				),
			);

			return { success: true, isRejected: true };
		}

		return { success: true };
	},
);

const peerApplicationSubmitted = inngest.createFunction(
	{ id: "peer-application-submitted" },
	{ event: "peer/application.submitted" },
	async ({ event, step }) => {
		const { id, userId } = event.data;

		const application = await step.run("fetch-application", async () =>
			PeerApplication.findOne({
				where: { id, userId },
				include: [StepResponse],
			}),
		);


		if (!application) return;

		const responses = application.StepResponses || [];
		const structuredResponse = {};

		for (const keyss of responses) {
			structuredResponse[keyss.stepKey] = keyss.responses;
		}

		const aiRunResult = await runAI(structuredResponse);

		const finalDecision = await step.run("combine-score", async () =>
			combineScores(aiRunResult),
		);

		await step.run("save-evaluation", async () =>
			storeEvaluation(id, {
				...finalDecision,
			}),
		);
		return { success: true };
	},
);

module.exports = {
	peerApplicationAutoReject,
	peerApplicationSubmitted,
};
