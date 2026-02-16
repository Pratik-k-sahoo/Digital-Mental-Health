const { AIEvaluation } = require("../../models");

const storeEvaluation = async (applicationId, result) => {
	console.log(result.summary);
	return AIEvaluation.create({
		applicationId,
		decision: result.decision,
		confidenceScore: result.weightedScore,
		emotionalStability: result.breakdown.stability,
		empathy: result.breakdown.empathy,
		boundaryAwareness: result.breakdown.boundaries,
		crisisHandling: result.breakdown.scenario,
		riskFlags: result.riskFlags,
		communication: result.breakdown.communication,
		summary: result.summary,
		recommendationNotes: result.recommendationNotes,
		strength: result.strengths,
		concern: result.concerns,
	});
};

module.exports = storeEvaluation;
