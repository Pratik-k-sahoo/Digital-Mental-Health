const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const socket = require("./utils/helper");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// own inputs
const socketAuth = require("./middlewares/socketAuth");
const EVENTS = require("../constants/socketEvent");
const { testConnection, sequelize } = require("./config/db");
const user = require("./routes/user");
const assessment = require("./routes/assessment");
const appointment = require("./routes/appointment");
const resources = require("./routes/resources");
const adminDashboard = require("./routes/adminDashboard");
const forum = require("./routes/forum");
const { inngest } = require("./inngest/client");
const { serve } = require("inngest/express");
const { onUserSignup } = require("./inngest/function/on-signup");

const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const { postCreated, postUpdated } = require("./inngest/function/forum-post");
const {
	flagCommentCreated,
	flagPostCreated,
} = require("./inngest/function/flag");
const {
	bookingGenerated,
	bookingConfirmed,
	bookingStatusChanged,
} = require("./inngest/function/appointment");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

const io = new Server(server, {
	cors: {
		origin: [
			"http://localhost:5173",
			"https://digital-mental-health.vercel.app",
		],
		credentials: true,
	},
});

io.use(socketAuth);
socket.init(io);

io.on("connection", (socket) => {
	logger.info(`🔌 Socket connected: ${socket.id}`);

	socket.on(EVENTS.JOIN_POST, (postId) => {
		socket.join(`post-${postId}`);
	});

	socket.on(EVENTS.TYPING_START, ({ postId }) => {
		if (!postId) return;

		socket.to(`post-${postId}`).emit(EVENTS.TYPING_START, {
			userId: socket.user.id,
			name: socket.user.name,
		});
	});

	socket.on(EVENTS.TYPING_STOP, ({ postId }) => {
		if (!postId) return;

		socket.to(`post-${postId}`).emit(EVENTS.TYPING_STOP, {
			userId: socket.user.id,
		});
	});

	socket.on("disconnect", () => {
		logger.info(`❌ Socket disconnected: ${socket.id}`);
	});
});

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://digital-mental-health.vercel.app",
		],
		credentials: true,
	}),
);
app.use(helmet());
app.use(cookieParser());
app.use(
	morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }),
);
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
// Inngest Entry Point
app.use(
	"/api/inngest",
	serve({
		client: inngest,
		functions: [
			onUserSignup,
			postCreated,
			postUpdated,
			flagCommentCreated,
			flagPostCreated,
			bookingGenerated,
			bookingConfirmed,
			bookingStatusChanged,
		],
	}),
);

app.get("/api/health", (req, res) => {
	const pool = sequelize.connectionManager.pool;
	res.status(200).json({
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
app.use("/api/forum", forum);

app.use(errorHandler);

async function start() {
	await testConnection();
	logger.info("DB Connected.");

	if (process.env.NODE_ENV === "development") {
		await sequelize.sync({
			alter: true,
		});
	}
	server.listen(PORT, "0.0.0.0", () => {
		console.log(`✅ Server connected successfully at PORT ${PORT}. 🚀`);
		logger.info(`✅ Server connected successfully at PORT ${PORT}. 🚀`);
	});
}

start().catch((err) => {
	console.log(err);
	logger.error("Failed to start: ", err);
	process.exit(1);
});
