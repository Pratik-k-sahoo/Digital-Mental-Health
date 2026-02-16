module.exports = (sequelize, DataTypes) => {
	const StepResponse = sequelize.define("StepResponse", {
		applicationId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		stepNumber: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		stepKey: {
			type: DataTypes.ENUM(
				"basic_info",
				"motivation",
				"lived_experience",
				"boundaries",
				"scenarios",
				"communication",
				"agreement",
				"background",
			),
			default: "basic_info",
		},
		responses: {
			type: DataTypes.JSON,
		},
		completed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	});

	return StepResponse;
};
