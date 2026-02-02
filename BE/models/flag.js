module.exports = (sequelize, DataTypes) => {
	const Flag = sequelize.define(
		"Flag",
		{
			reason: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM("pending", "reviewed", "resolved"),
				allowNull: false,
				defaultValue: "pending",
			},
			reviewBatch: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			tableName: "flags",
			timestamps: true,
		},
	);

	return Flag;
};
