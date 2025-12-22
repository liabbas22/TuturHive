// --- Imports ---
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import Student from "./models/Student.js";
import Tutor from "./models/Tutor.js";
import Message from "./models/Message.js";

import StudentsRoutes from "./routes/students.routes.js";
import TutorsRoutes from "./routes/tutors.routes.js";
import CoursesRoutes from "./routes/course.routes.js";
import MessagesRoutes from "./routes/messages.routes.js";

// --- Config ---
dotenv.config();
connectDB();

// --- Express App ---
const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// --- Middlewares ---
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Serve temporary uploads directory
app.use("/api/uploads", express.static("/tmp/uploads"));

// --- Root Route ---
app.get("/", (_req, res) => {
  res.send("TuturHive API is running!");
});

// --- Health Route ---
app.get("/api/health", (_req, res) => res.status(200).send("OK"));

// --- Routes ---
app.use("/api/course", CoursesRoutes);
app.use("/api/auth/student", StudentsRoutes);
app.use("/api/auth/tutor", TutorsRoutes);
app.use("/api/messages", MessagesRoutes);

// --- HTTP + Socket.IO ---
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

global.io = io;

// --- Socket Auth Middleware ---
io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .filter(Boolean)
        .map((c) => {
          const [k, ...v] = c.trim().split("=");
          return [decodeURIComponent(k), decodeURIComponent(v.join("=") || "")];
        })
    );
    const token = cookies["token"];
    if (!token) return next(new Error("Unauthorized"));
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    socket.data.user = payload; // { id, role }
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

// --- Online Users Map ---
const onlineUsers = new Map();

// --- Socket Events ---
io.on("connection", async (socket) => {
  const { id: userId, role } = socket.data.user || {};
  if (!userId) return socket.disconnect(true);

  console.log(`✅ Connected: ${userId} (${role})`);

  // Save socketId to DB
  try {
    if (role === "student") {
      await Student.findByIdAndUpdate(userId, { socketId: socket.id });
    } else if (role === "tutor") {
      await Tutor.findByIdAndUpdate(userId, { socketId: socket.id });
    }
  } catch (err) {
    console.error("Error updating user socketId", err);
  }

  onlineUsers.set(userId, socket.id);
  socket.broadcast.emit("user_online", { userId, role });

  // Join personal room for multi-device support
  socket.on("join", ({ userId: joinUserId }) => {
    if (joinUserId && joinUserId === String(userId)) {
      socket.join(`user:${joinUserId}`);
    }
  });

  // Handle private messages
  socket.on("private_message", async ({ toUserId, message, messageType = "text", tempId }) => {
    if (!toUserId || !message) return;

    try {
      const senderRole = role;
      const receiverRole = senderRole === "student" ? "tutor" : "student";

      const msg = new Message({
        sender: userId,
        senderModel: senderRole === "student" ? "Student" : "Tutor",
        receiver: toUserId,
        receiverModel: receiverRole === "student" ? "Student" : "Tutor",
        content: message.trim(),
        messageType,
        status: "sent",
      });

      await msg.save();
      await msg.populate([
        { path: "sender", select: "name email" },
        { path: "receiver", select: "name email" },
      ]);

      let recipient = await Student.findById(toUserId).select("socketId");
      if (!recipient) recipient = await Tutor.findById(toUserId).select("socketId");
      const toSocketId = recipient?.socketId;

      if (toSocketId && toSocketId !== socket.id) io.to(toSocketId).emit("new_message", msg);
      if (toUserId !== String(userId)) io.to(`user:${toUserId}`).emit("new_message", msg);

      msg.status = toSocketId ? "delivered" : "sent";
      await msg.save();

      socket.emit("message_sent", {
        _id: msg._id,
        status: msg.status,
        createdAt: msg.createdAt,
        realId: tempId ?? msg._id,
      });
    } catch (err) {
      console.error("Socket message error:", err);
      socket.emit("message_error", { message: "Failed to send" });
    }
  });

  // Generic notify user event
  socket.on("notify_user", async ({ toUserId, event, payload }) => {
    if (!toUserId || !event) return;
    io.to(`user:${toUserId}`).emit(event, payload);

    let recipient = await Student.findById(toUserId).select("socketId");
    if (!recipient) recipient = await Tutor.findById(toUserId).select("socketId");
    const toSocketId = recipient?.socketId;
    if (toSocketId) io.to(toSocketId).emit(event, payload);
  });

  // Mark as read
  socket.on("mark_as_read", async ({ fromUserId }) => {
    if (!fromUserId) return;
    await Message.updateMany(
      { sender: fromUserId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );
    io.to(`user:${fromUserId}`).emit("messages_read", {
      byUserId: userId,
      readAt: new Date(),
    });
    let sender = await Student.findById(fromUserId).select("socketId");
    if (!sender) sender = await Tutor.findById(fromUserId).select("socketId");
    if (sender?.socketId) io.to(sender.socketId).emit("messages_read", {
      byUserId: userId,
      readAt: new Date(),
    });
  });

  // Disconnect
  socket.on("disconnect", async () => {
    try {
      if (role === "student") await Student.findByIdAndUpdate(userId, { $unset: { socketId: 1 } });
      else if (role === "tutor") await Tutor.findByIdAndUpdate(userId, { $unset: { socketId: 1 } });
    } catch (err) {
      console.error("Error unsetting socketId on disconnect", err);
    }
    onlineUsers.delete(userId);
    socket.broadcast.emit("user_offline", { userId, role });
    console.log(`❌ Disconnected: ${userId}`);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
