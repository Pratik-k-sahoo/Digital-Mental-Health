const CRISIS_KEYWORDS = [
	"suicide",
	"kill myself",
	"end my life",
	"self harm",
	"cut myself",
	"die",
];

function getStepKey(keyNumber) {
	console.log(keyNumber);
	const steps = [
		{ id: 1, key: "basic_info" },
		{ id: 2, key: "motivation" },
		{ id: 3, key: "lived_experience" },
		{ id: 4, key: "boundaries" },
		{ id: 5, key: "scenarios" },
		{ id: 6, key: "communication" },
		{ id: 7, key: "agreement" },
		{ id: 8, key: "background" },
	];

	const keyName = steps.filter((key) => key.id === Number(keyNumber));
	console.log(keyName);
	return keyName[0].key;
}
const safeParse = (raw) => {
	try {
		const cleaned = raw
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim();

		const parsed = JSON.parse(cleaned);

		return parsed;
	} catch (err) {
		console.error("AI JSON parse failed:", raw);

		// Return structured fallback matching expected schema
		return {
			stability: {
				score: 1,
				riskFlags: ["parse_error"],
				notes: "AI parse failed",
			},
			empathy: {
				score: 1,
				riskFlags: ["parse_error"],
				notes: "AI parse failed",
			},
			boundaries: {
				score: 1,
				riskFlags: ["parse_error"],
				notes: "AI parse failed",
			},
			scenario: {
				score: 1,
				riskFlags: ["parse_error"],
				crisisCompetent: false,
				notes: "AI parse failed",
			},
		};
	}
};


function scanForCrisis(text = "") {
	const lower = text.toLowerCase();
	return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
}

let io;

module.exports = {
	scanForCrisis,
	init: (serverIo) => {
		io = serverIo;
		return io;
	},
	getIO: () => {
		if (!io) {
			throw new Error("Socket.io not initialized");
		}
		return io;
	},
	getStepKey,
	safeParse,
};
