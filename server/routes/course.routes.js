import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import courseController from "../controllers/course.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// Multer storage for serverless /tmp
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = "/tmp/uploads";

    // Create /tmp/uploads only when needed
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

const upload = multer({ storage });

// ================= ROUTES =================
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
