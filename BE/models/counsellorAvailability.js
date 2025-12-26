module.exports = (sequelize, DataTypes) => {
	const CounsellorAvailability = sequelize.define(
		"CounsellorAvailability",
		{
			counsellorId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			daysOfWeek: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					min: 0,
					max: 6,
				},
			},
			startTime: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			endTime: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			slotDuration: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 30,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
		},
		{
			tableName: "counsellor_availabilities",
			timestamps: true,
			indexes: [
				{
					fields: ["counsellorId", "daysOfWeek"],
				},
			],
		}
	);

	return CounsellorAvailability;
};
