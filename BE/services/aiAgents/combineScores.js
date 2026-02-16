const combineScores = (aiRunResult) => {
	const {
		stability,
		empathy,
		boundaries,
		scenario,
		communication,
		strengths,
		concerns,
		summary,
		recommendationNotes,
	} = aiRunResult;
	const total =
		stability.score * 0.25 +
		empathy.score * 0.2 +
		boundaries.score * 0.2 +
		scenario.score * 0.2 +
		communication.score * 0.15;

	console.log(strengths, concerns);

	const riskFlags = [
		...stability.riskFlags,
		...empathy.riskFlags,
		...boundaries.riskFlags,
		...scenario.riskFlags,
	];

	let decision = "interview";

	if (riskFlags.length > 0 && scenario.crisisCompetent === false) {
		decision = "reject";
	} else if (total >= 8.5) {
		decision = "approve";
	} else if (total >= 7.0) {
		decision = "approve_supervised";
	} else if (total >= 5.5) {
		decision = "interview";
	} else {
		decision = "reject";
	}

	return {
		decision,
		weightedScore: Math.round(total * 10) / 10,
		breakdown: {
			stability: stability.score,
			empathy: empathy.score,
			boundaries: boundaries.score,
			scenario: scenario.score,
			communication: communication.score,
		},
		riskFlags,
		strengths: [...strengths],
		concerns: [...concerns],
		summary,
		recommendationNotes,
	};
};

module.exports = combineScores;
