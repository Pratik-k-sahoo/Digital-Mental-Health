module.exports = (sequelize, DataTypes) => {
	const AIEvaluation = sequelize.define("AIEvaluation", {
		applicationId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		decision: DataTypes.STRING,
		confidenceScore: DataTypes.FLOAT,
		emotionalStability: DataTypes.INTEGER,
		empathy: DataTypes.INTEGER,
		boundaryAwareness: DataTypes.INTEGER,
		crisisHandling: DataTypes.INTEGER,
		riskFlags: DataTypes.JSON,
		communication: DataTypes.INTEGER,
		strength: DataTypes.JSON,
		concern: DataTypes.JSON,
		summary: DataTypes.TEXT,
		recommendationNotes: DataTypes.TEXT,
	});

	return AIEvaluation;
};
