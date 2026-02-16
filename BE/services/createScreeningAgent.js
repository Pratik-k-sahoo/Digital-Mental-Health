const { createAgent, gemini } = require("@inngest/agent-kit");
const dotenv = require("dotenv");
dotenv.config();

const createScreeningAgent = (systemPrompt) => {
	return createAgent({
		model: gemini({
			model: "gemini-2.5-flash",
			apiKey: process.env.GEMINI_API_KEY,
		}),
		name: "Peer Screening Specialist",
		system: systemPrompt,
	});
};

module.exports = createScreeningAgent;
