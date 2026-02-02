module.exports = (sequelize, DataTypes) => {
	const ForumComment = sequelize.define(
		"ForumComment",
		{
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM("visible", "hidden", "flagged"),
				allowNull: false,
				defaultValue: "visible",
			},
			isAnonymous: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			displayName: {
				type: DataTypes.STRING,
				allowNull: true,
				default: "Anonymous Student",
			},
			currentReviewBatch: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
		},
		{
			tableName: "forum_comments",
			timestamps: true,
		},
	);

	return ForumComment;
};
