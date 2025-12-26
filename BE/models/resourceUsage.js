module.exports = (sequelize, DataTypes) => {
	const ResourceUsage = sequelize.define(
		"ResourceUsage",
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			resourceId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			tableName: "resource_usages",
			timestamps: true,
		}
	);

	return ResourceUsage;
};
