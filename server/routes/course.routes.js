import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import courseController from "../controllers/course.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

/* ===============================
   Multer configuration - Vercel-safe
   =============================== */
const TMP_DIR = "/tmp/uploads";

// Ensure temporary directory exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, TMP_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeName = file.originalname.replace(/\s+/g, "_"); // replace spaces
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
});

/* ===============================
   Routes
   =============================== */

// Create course with file uploads
router.post(
  "/create",
  requireAuth,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  courseController.createCourse
);

// List all courses
router.get("/", courseController.listCourses);

// Get course by ID
router.get("/:id", courseController.getCourseById);

// Delete course by ID
router.delete("/:id", requireAuth, courseController.deleteCourse);

export default router;
