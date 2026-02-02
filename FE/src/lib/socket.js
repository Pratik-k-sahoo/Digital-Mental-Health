import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL, {
	path: "/socket.io",
	withCredentials: true,
	transports: ["websocket"],
	autoConnect: false,
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
});

export const disconnectSocket = () => {
	socket.disconnect();
};

if (import.meta.env.DEV) {
	socket.on("connect", () => {
		console.log("🟢 Socket connected:");
	});

	socket.on("disconnect", (reason) => {
		console.log("🔴 Socket disconnected:");
	});

	socket.on("connect_error", (err) => {
		console.error("❌ Socket error:", err.message);
	});
}

export default socket;
