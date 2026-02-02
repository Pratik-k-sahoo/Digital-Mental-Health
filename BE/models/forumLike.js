module.exports = (sequelize, DataTypes) => {
	const ForumLike = sequelize.define(
		"ForumLike",
		{},
		{
			tableName: "forum_likes",
			timestamps: true,
		},
	);

	return ForumLike;
};
