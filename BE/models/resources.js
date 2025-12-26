module.exports = (sequelize, DataTypes) => {
	const Resource = sequelize.define(
		"Resource",
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			category: {
				type: DataTypes.ENUM(
					"stress",
					"anxiety",
					"sleep",
					"exam_pressure",
					"relationship"
				),
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM("article", "video", "audio"),
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			url: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			language: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "en",
			},
			isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
			isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
			tags: {
				type: DataTypes.JSON,
				allowNull: true,
				defaultValue: [],
				validate: {
					isArrayOfStrings(value) {
						if (!Array.isArray(value)) {
							throw new Error("Tags must be an array");
						}
						if (!value.every((tag) => typeof tag === "string")) {
							throw new Error("Each tag must be a string");
						}
					},
				},
			},
		},
		{
			tableName: "resources",
			timestamps: true,
		}
	);

	return Resource;
};
