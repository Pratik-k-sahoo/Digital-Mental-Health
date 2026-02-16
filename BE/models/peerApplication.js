module.exports = (sequelize, DataTypes) => {
	const PeerApplication = sequelize.define(
		"PeerApplication",
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			currentStep: {
				type: DataTypes.INTEGER,
				defaultValue: 1,
			},
			isDraft: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			isSubmitted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			status: {
				type: DataTypes.ENUM(
					"draft",
					"submitted",
					"ai_reviewed",
					"admin_reviewed",
					"approved",
					"approved_supervised",
					"rejected",
				),
				defaultValue: "draft",
			},
		},
		{
			tableName: "peer_application",
			timestamps: true,
		},
	);

	return PeerApplication;
};
