import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import StudentsRoutes from "./routes/students.routes.js";
import TutorsRoutes from "./routes/tutors.routes.js";
import CoursesRoutes from "./routes/course.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
connectDB();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/uploads", express.static("uploads"));
app.get("/api/health", (_req, res) => res.status(200).send("OK"));
app.use("/api/course", CoursesRoutes);
app.use("/api/auth/student", StudentsRoutes);
app.use("/api/auth/tutor", TutorsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
