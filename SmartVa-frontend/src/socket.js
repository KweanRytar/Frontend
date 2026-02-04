// socket.js
import { io } from "socket.io-client";

const socket_url = "http://localhost:5000";

export const socket = io(socket_url, {
  withCredentials: true,
  autoConnect: false,
});

// 🔥 DEBUG LISTENERS (VERY IMPORTANT)
socket.on("connect", () => {
  console.log("✅ Socket CONNECTED:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket DISCONNECTED:", reason);
});

socket.on("connect_error", (err) => {
  console.error("🚨 Socket connection error:", err.message);
});
