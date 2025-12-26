module.exports = (sequelize, DataTypes) => {
	const Appointment = sequelize.define(
		"Appointment",
		{
			datetime: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM(
					"pending",
					"confirmed",
					"cancelled",
					"completed",
					"expired"
				),
				allowNull: false,
				defaultValue: "pending",
			},
			appointmentType: {
				type: DataTypes.ENUM("in-person", "virtual"),
				allowNull: false,
				defaultValue: "in-person",
			},
			notes: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			qr_token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			qr_expiresAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			tableName: "appointments",
			timestamps: true,
		}
	);

	return Appointment;
};
