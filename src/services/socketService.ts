import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socketService = {
  /**
   * Connect to Socket.IO server. Use only ONE socket for the app.
   * @param userId Optional user identifier to register at connect.
   */
  connect: (userId?: string): Socket => {
    // If already connected/connecting, return the existing instance
    if (socket && socket.connected) {
      // If an existing socket is connected but a new userId is provided,
      // emit join/register again to ensure the server joins the personal room.
      if (userId) {
        socket.emit("register_user", { userId });
        socket.emit("join", { userId });
      }
      return socket;
    }

    // Create new socket connection
    socket = io(SERVER_URL, {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 1000,
    });

    // Register user with server (by id) on connect
    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket?.id ?? "(no id)");
      if (userId) {
        // emit both for backward compatibility and to ensure the server joins the personal room
        socket?.emit("register_user", { userId });
        socket?.emit("join", { userId });
      }
    });

    socket.on("reconnect", (attempt) => {
      console.log(`🔁 Reconnected after ${attempt} attempts`);
      if (userId) {
        socket?.emit("register_user", { userId });
        socket?.emit("join", { userId });
      }
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err?.message || err);
    });

    return socket;
  },

  /**
   * Get the existing socket instance (or null if not connected)
   */
  getSocket: (): Socket | null => socket,

  /**
   * Disconnect completely and cleanup
   */
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log("👋 Socket disconnected cleanly");
    }
  },
};

export default socketService;
