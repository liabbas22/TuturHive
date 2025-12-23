import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";
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

dotenv.config();
connectDB();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const __dirname = path.resolve();

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* ✅ SERVE UPLOADED FILES (IMPORTANT FIX) */
app.use("/api/uploads", express.static("/tmp"));

app.get("/api/health", (_req, res) => res.send("OK"));

app.use("/api/course", CoursesRoutes);
app.use("/api/auth/student", StudentsRoutes);
app.use("/api/auth/tutor", TutorsRoutes);
app.use("/api/messages", MessagesRoutes);

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});

global.io = io;

io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").filter(Boolean).map(c => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
    );

    const token = cookies.token;
    if (!token) throw new Error();

    socket.data.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", async socket => {
  const { id: userId, role } = socket.data.user;
  if (!userId) return socket.disconnect();

  if (role === "student")
    await Student.findByIdAndUpdate(userId, { socketId: socket.id });
  if (role === "tutor")
    await Tutor.findByIdAndUpdate(userId, { socketId: socket.id });

  socket.on("join", ({ userId }) => socket.join(`user:${userId}`));

  socket.on("disconnect", async () => {
    if (role === "student")
      await Student.findByIdAndUpdate(userId, { $unset: { socketId: 1 } });
    if (role === "tutor")
      await Tutor.findByIdAndUpdate(userId, { $unset: { socketId: 1 } });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
