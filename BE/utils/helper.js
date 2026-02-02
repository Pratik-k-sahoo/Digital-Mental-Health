const CRISIS_KEYWORDS = [
	"suicide",
	"kill myself",
	"end my life",
	"self harm",
	"cut myself",
	"die",
];

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
};
