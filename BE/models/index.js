const { sequelize } = require("../config/db");

const { DataTypes } = require("sequelize");

const UserModel = require("./user");
const AssessmentModel = require("./assessment");
const AppointmentModel = require("./appointment");
const CounsellorAvailabilityModel = require("./counsellorAvailability");
const ResourceModel = require("./resources");
const ResourceUsageModel = require("./resourceUsage");
const AlertThresholdModel = require("./alertThreshold");
const ForumPostModel = require("./forumPost");
const ForumCommentModel = require("./forumComment");
const ForumLikeModel = require("./forumLike");
const ForumBookmarkModel = require("./forumBookmark");
const FlagModel = require("./flag");
const PeerApplicationModel = require("./peerApplication");
const StepResponseModel = require("./stepResponse");
const AIEvaluationModel = require("./aiEvaluation");

const User = UserModel(sequelize, DataTypes);
const Assessment = AssessmentModel(sequelize, DataTypes);
const Appointment = AppointmentModel(sequelize, DataTypes);
const CounsellorAvail = CounsellorAvailabilityModel(sequelize, DataTypes);
const Resource = ResourceModel(sequelize, DataTypes);
const ResourceUsage = ResourceUsageModel(sequelize, DataTypes);
const AlertThreshold = AlertThresholdModel(sequelize, DataTypes);
const ForumPost = ForumPostModel(sequelize, DataTypes);
const ForumComment = ForumCommentModel(sequelize, DataTypes);
const ForumLike = ForumLikeModel(sequelize, DataTypes);
const ForumBookmark = ForumBookmarkModel(sequelize, DataTypes);
const Flag = FlagModel(sequelize, DataTypes);
const PeerApplication = PeerApplicationModel(sequelize, DataTypes);
const StepResponse = StepResponseModel(sequelize, DataTypes);
const AIEvaluation = AIEvaluationModel(sequelize, DataTypes);

//Assessment User Relationship
User.hasMany(Assessment, {
	foreignKey: { name: "userId", allowNull: false },
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Assessment.belongsTo(User, {
	foreignKey: { name: "userId", allowNull: false },
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

//Appointment User Relationship
User.hasMany(Appointment, {
	as: "StudentAppointments",
	foreignKey: {
		name: "studentId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
User.hasMany(Appointment, {
	as: "CounsellorAppointments",
	foreignKey: {
		name: "counsellorId",
		allowNull: true,
	},
	onDelete: "SET NULL",
	onUpdate: "CASCADE",
});
Appointment.belongsTo(User, {
	as: "Student",
	foreignKey: {
		name: "studentId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Appointment.belongsTo(User, {
	as: "Counsellor",
	foreignKey: {
		name: "counsellorId",
		allowNull: true,
	},
	onDelete: "SET NULL",
	onUpdate: "CASCADE",
});

//Counsellor User Relationship
User.hasMany(CounsellorAvail, {
	foreignKey: { name: "counsellorId", allowNull: true },
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
CounsellorAvail.belongsTo(User, {
	foreignKey: { name: "counsellorId", allowNull: true },
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

// ResourceUsage user resource Relationships
User.hasMany(ResourceUsage, { foreignKey: "userId", onDelete: "CASCADE" });
Resource.hasMany(ResourceUsage, {
	foreignKey: "resourceId",
	onDelete: "CASCADE",
});
ResourceUsage.belongsTo(User, { foreignKey: "userId" });
ResourceUsage.belongsTo(Resource, { foreignKey: "resourceId" });

User.hasOne(AlertThreshold, {
	foreignKey: {
		name: "userId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
AlertThreshold.belongsTo(User, {
	foreignKey: {
		name: "userId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasMany(ForumPost, {
	foreignKey: {
		name: "authorId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
ForumPost.belongsTo(User, {
	foreignKey: {
		name: "authorId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

ForumPost.hasMany(ForumComment, {
	foreignKey: {
		name: "postId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
ForumComment.belongsTo(ForumPost, {
	foreignKey: {
		name: "postId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasMany(ForumComment, {
	foreignKey: {
		name: "authorId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
ForumComment.belongsTo(User, {
	foreignKey: {
		name: "authorId",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.hasMany(Flag, {
	foreignKey: {
		name: "flaggedBy",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
Flag.belongsTo(User, {
	foreignKey: {
		name: "flaggedBy",
		allowNull: false,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

ForumPost.hasMany(Flag, {
	foreignKey: {
		name: "postId",
		allowNull: true,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

Flag.belongsTo(ForumPost, {
	foreignKey: {
		name: "postId",
		allowNull: true,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

ForumComment.hasMany(Flag, {
	foreignKey: {
		name: "commentId",
		allowNull: true,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

Flag.belongsTo(ForumComment, {
	foreignKey: {
		name: "commentId",
		allowNull: true,
	},
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

User.belongsToMany(ForumPost, {
	through: ForumLike,
	foreignKey: "userId",
	otherKey: "postId",
});

ForumPost.belongsToMany(User, {
	through: ForumLike,
	foreignKey: "postId",
	otherKey: "userId",
});

User.belongsToMany(ForumPost, {
	through: ForumBookmark,
	foreignKey: "userId",
	otherKey: "postId",
	as: "BookmarkedPosts",
});

ForumPost.belongsToMany(User, {
	through: ForumBookmark,
	foreignKey: "postId",
	otherKey: "userId",
	as: "BookmarkedBy",
});

PeerApplication.hasMany(StepResponse, {
	foreignKey: "applicationId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
PeerApplication.belongsTo(User, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
User.hasMany(PeerApplication, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

StepResponse.belongsTo(PeerApplication, {
	foreignKey: "applicationId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

PeerApplication.hasOne(AIEvaluation, {
	foreignKey: "applicationId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});
AIEvaluation.belongsTo(PeerApplication, {
	foreignKey: "applicationId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE",
});

module.exports = {
	User,
	Assessment,
	Appointment,
	CounsellorAvail,
	Resource,
	ResourceUsage,
	AlertThreshold,
	ForumPost,
	ForumComment,
	ForumLike,
	ForumBookmark,
	Flag,
	PeerApplication,
	StepResponse,
  AIEvaluation
};
