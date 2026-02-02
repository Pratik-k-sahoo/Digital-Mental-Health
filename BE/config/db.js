const { Sequelize } = require("sequelize");
require("dotenv").config();

const dialect = process.env.DB_DIALECT || "mysql";

const sequelize = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect,
		dialectOptions: {
			ssl: {
				rejectUnauthorized: true,
			},
		},
		logging: (msg) => console.log(msg),
		pool: {
			max: 10,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);

async function testConnection() {
	try {
		await sequelize.authenticate();
		console.log("✅ Database connection has been established.");
	} catch (error) {
		console.error("❌ Unable to connect to the database: ", error.message);
	}
}

module.exports = {
	sequelize,
	testConnection,
};
