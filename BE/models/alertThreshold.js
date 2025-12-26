module.exports = (sequelize, DataTypes) => {
	const AlertThreshold = sequelize.define(
		"AlertThreshold",
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			pendingAppointments: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 10,
			},
			severeAssessments: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 5,
			},
			moderateSevereAssessments: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 15,
			},
			avgPHQ9Score: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 15,
			},
			avgGAD7Score: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 12,
			},
			enablePendingAppointments: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			enableSevereAssessments: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			enableModerateSevereAssessments: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			enableAvgPHQ9Score: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			enableAvgGAD7Score: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
		},
		{
			tableName: "alert_threshold",
			timestamps: true,
		}
	);

	return AlertThreshold;
};
