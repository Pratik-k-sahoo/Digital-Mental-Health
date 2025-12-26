const bcrypt = require("bcryptjs");
const { where } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: { isEmail: true },
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.ENUM(
					"student",
					"counsellor",
					"admin",
					"peer_volunteer"
				),
				allowNull: false,
				defaultValue: "student",
			},
			department: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			year: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			tableName: "users",
			timestamps: true,
			updatedAt: "updateTimestamp",
		}
	);

	User.prototype.checkPassword = async function (password) {
		return await bcrypt.compare(password, this.password);
	};

	User.afterCreate(async (user, options) => {
		if (!["counsellor", "admin"].includes(user?.role)) return;

		const { AlertThreshold } = require("./index");
		await AlertThreshold.findOrCreate({
			where: { userId: user?.id },
		});
	});

	User.afterUpdate(async (user) => {
		if (!user.changed("role")) return;

    if (!["counsellor", "admin"].includes(user?.role)) return;
    const { AlertThreshold } = require("./index");
		await AlertThreshold.findOrCreate({
			where: { userId: user?.id },
		});
	});

	return User;
};
