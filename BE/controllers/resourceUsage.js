const { ResourceUsage } = require("../models");

async function trackUsage(req, res) {
	try {
		const user = req.user;
		const { resourceId } = req.body;

    if (!user || !resourceId) {
			return res.status(400).json({ message: "Invalid data" });
		}

		await ResourceUsage.create({ userId: user?.id, resourceId });

		res.status(201).json({ message: "Resource usage tracked successfully." });
	} catch (error) {
		res.status(500).json({ message: "Error tracking resource usage.", error });
	}
}

module.exports = {
	trackUsage,
};
