module.exports = (sequelize, DataTypes) => {
	const ForumBookmark = sequelize.define(
		"ForumBookmark",
		{},
		{
			tableName: "forum_bookmarks",
			timestamps: true,
		},
	);

	return ForumBookmark;
};
