function calculatePHQ9Score(answers) {
	const total = answers.reduce((a, b) => a + Number(b || 0), 0);
	let severity = "minimal";
	if (total >= 5 && total <= 9) severity = "mild";
	else if (total >= 10 && total <= 14) severity = "moderate";
	else if (total >= 15 && total <= 19) severity = "moderately_severe";
	else if (total >= 20) severity = "severe";

	return { score: total, severity };
}

function calculateGAD7Score(answers) {
	const total = answers.reduce((a, b) => a + Number(b || 0), 0);
	let severity = "minimal";
	if (total >= 5 && total <= 9) severity = "mild";
	else if (total >= 10 && total <= 14) severity = "moderate";
	else if (total >= 15) severity = "severe";

	return { score: total, severity };
}

module.exports = {
	calculatePHQ9Score,
	calculateGAD7Score,
};
