const { sequelize } = require("../config/db");

const { DataTypes } = require("sequelize");

const UserModel = require("./user");
const AssessmentModel = require("./assessment");
const AppointmentModel = require("./appointment");
const CounsellorAvailabilityModel = require("./counsellorAvailability");
const ResourceModel = require("./resources");
const ResourceUsageModel = require("./resourceUsage");
const AlertThresholdModel = require("./alertThreshold");

const User = UserModel(sequelize, DataTypes);
const Assessment = AssessmentModel(sequelize, DataTypes);
const Appointment = AppointmentModel(sequelize, DataTypes);
const CounsellorAvail = CounsellorAvailabilityModel(sequelize, DataTypes);
const Resource = ResourceModel(sequelize, DataTypes);
const ResourceUsage = ResourceUsageModel(sequelize, DataTypes);
const AlertThreshold = AlertThresholdModel(sequelize, DataTypes);

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
    allowNull: false
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
})

module.exports = {
	User,
	Assessment,
	Appointment,
	CounsellorAvail,
	Resource,
	ResourceUsage,
	AlertThreshold,
};
