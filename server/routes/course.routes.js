import express from "express";
import multer from "multer";
import courseController from "../controllers/course.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

/* ✅ VERCEL-SAFE TEMP DIRECTORY */
const upload = multer({
  storage: multer.diskStorage({
    destination: "/tmp",
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${unique}-${file.originalname}`);
    },
  }),
});

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
