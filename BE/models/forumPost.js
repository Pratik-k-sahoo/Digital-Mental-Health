module.exports = (sequelize, DataTypes) => {
	const ForumPost = sequelize.define(
		"ForumPost",
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			category: {
				type: DataTypes.STRING,
				allowNull: false,
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
			status: {
				type: DataTypes.ENUM("visible", "hidden", "flagged"),
				allowNull: false,
				defaultValue: "visible",
			},
			isLocked: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			lockReason: {
				type: DataTypes.ENUM(
					"auto_flag",
					"crisis_detected",
					"moderator_action",
					"heated_discussion",
				),
				allowNull: true,
				defaultValue: null,
			},
			currentReviewBatch: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
		},
		{
			tableName: "forum_posts",
			timestamps: true,
		},
	);

	return ForumPost;
};
