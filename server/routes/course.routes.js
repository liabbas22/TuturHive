import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import courseController from "../controllers/course.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

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
