const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// own inputs
const { testConnection, sequelize } = require("./config/db");
const user = require("./routes/user");
const assessment = require("./routes/assessment");
const appointment = require("./routes/appointment");
const resources = require("./routes/resources");
const adminDashboard = require("./routes/adminDashboard");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://zmhp4r3q-5173.inc1.devtunnels.ms",
		],
		credentials: true,
	})
);
app.use(helmet());
app.use(cookieParser());
app.use(
	morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  const pool = sequelize.connectionManager.pool;
  res
		.status(200)
		.json({
			message: "OK✅",
			total: pool.size,
			idle: pool.available,
			waiting: pool.pending,
		});
});
app.use("/api/user", user);
app.use("/api/assessment", assessment);
app.use("/api/appointment", appointment);
app.use("/api/resource", resources);
app.use("/api/admin/dashboard", adminDashboard);

app.use(errorHandler);

async function start() {
	await testConnection();
	logger.info("DB Connected.");

	if (process.env.NODE_ENV !== "development") {
		await sequelize.sync({
			alter: true,
		});
		console.log("Models synced");
	}
	app.listen(PORT, "0.0.0.0", () => {
		console.log(`✅ Server connected successfully at PORT ${PORT}. 🚀`);
		logger.info(`✅ Server connected successfully at PORT ${PORT}. 🚀`);
	});
}

start().catch((err) => {
	logger.error("Failed to start: ", err);
	process.exit(1);
});
