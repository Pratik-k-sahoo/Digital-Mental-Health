module.exports = (sequelize, DataTypes) => {
	const Assessment = sequelize.define(
		"Assessment",
		{
			type: {
				type: DataTypes.ENUM("PHQ9", "GAD7", "GHQ"),
				allowNull: false,
			},
			answers: {
				type: DataTypes.JSON,
				allowNull: false,
			},
			score: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			severity: {
				type: DataTypes.ENUM(
					"minimal",
					"mild",
					"moderate",
					"moderately_severe",
					"severe"
				),
				allowNull: false,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			tableName: "assessment",
			timestamps: true,
		}
	);

	return Assessment;
};
