export function getPhq9Result(score) {
	if (score <= 4) {
		return {
			score,
			severity: "severity.minimalDepression",
			severityKey: "severity.minimalDepression",
			color: "text-green-600",
			recommendationKeys: [
				"rec.minimalDepression1",
				"rec.minimalDepression2",
				"rec.minimalDepression3",
				"rec.minimalDepression4",
				"rec.minimalDepression5",
			],
		};
	} else if (score <= 9) {
		return {
			score,
			severity: "severity.mildDepression",
			severityKey: "severity.mildDepression",
			color: "text-yellow-600",
			recommendationKeys: [
				"rec.mildDepression1",
				"rec.mildDepression2",
				"rec.mildDepression3",
				"rec.mildDepression4",
				"rec.mildDepression5",
			],
		};
	} else if (score <= 14) {
		return {
			score,
			severity: "severity.moderateDepression",
			severityKey: "severity.moderateDepression",
			color: "text-orange-600",
			recommendationKeys: [
				"rec.moderateDepression1",
				"rec.moderateDepression2",
				"rec.moderateDepression3",
				"rec.moderateDepression4",
				"rec.moderateDepression5",
				"rec.moderateDepression6",
			],
		};
	} else if (score <= 19) {
		return {
			score,
			severity: "severity.moderatelySevereDepression",
			severityKey: "severity.moderatelySevereDepression",
			color: "text-red-500",
			recommendationKeys: [
				"rec.moderatelySevereDepression1",
				"rec.moderatelySevereDepression2",
				"rec.moderatelySevereDepression3",
				"rec.moderatelySevereDepression4",
				"rec.moderatelySevereDepression5",
				"rec.moderatelySevereDepression6",
			],
		};
	} else {
		return {
			score,
			severity: "severity.severeDepression",
			severityKey: "severity.severeDepression",
			color: "text-red-700",
			recommendationKeys: [
				"rec.severeDepression1",
				"rec.severeDepression2",
				"rec.severeDepression3",
				"rec.severeDepression4",
				"rec.severeDepression5",
				"rec.severeDepression6",
			],
		};
	}
}

export function getGad7Result(score) {
	if (score <= 4) {
		return {
			score,
			severity: "severity.minimalAnxiety",
			severityKey: "severity.minimalAnxiety",
			color: "text-green-600",
			recommendationKeys: [
				"rec.minimalAnxiety1",
				"rec.minimalAnxiety2",
				"rec.minimalAnxiety3",
				"rec.minimalAnxiety4",
				"rec.minimalAnxiety5",
			],
		};
	} else if (score <= 9) {
		return {
			score,
			severity: "severity.mildAnxiety",
			severityKey: "severity.mildAnxiety",
			color: "text-yellow-600",
			recommendationKeys: [
				"rec.mildAnxiety1",
				"rec.mildAnxiety2",
				"rec.mildAnxiety3",
				"rec.mildAnxiety4",
				"rec.mildAnxiety5",
			],
		};
	} else if (score <= 14) {
		return {
			score,
			severity: "severity.moderateAnxiety",
			severityKey: "severity.moderateAnxiety",
			color: "text-orange-600",
			recommendationKeys: [
				"rec.moderateAnxiety1",
				"rec.moderateAnxiety2",
				"rec.moderateAnxiety3",
				"rec.moderateAnxiety4",
				"rec.moderateAnxiety5",
				"rec.moderateAnxiety6",
			],
		};
	} else {
		return {
			score,
			severity: "severity.severeAnxiety",
			severityKey: "severity.severeAnxiety",
			color: "text-red-600",
			recommendationKeys: [
				"rec.severeAnxiety1",
				"rec.severeAnxiety2",
				"rec.severeAnxiety3",
				"rec.severeAnxiety4",
				"rec.severeAnxiety5",
				"rec.severeAnxiety6",
			],
		};
	}
}
