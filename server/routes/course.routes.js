import express from "express";
import multer from "multer";
import courseController from "../controllers/course.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

/* ===============================
   Multer configuration - Vercel-safe
   =============================== */
const storage = multer.diskStorage({
  destination: "/tmp", // Vercel writable temporary directory
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max file size (adjust if needed)
});

/* ===============================
   Routes
   =============================== */
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

router.get("/", courseController.listCourses);
router.get("/:id", courseController.getCourseById);
router.delete("/:id", requireAuth, courseController.deleteCourse);

export default router;
