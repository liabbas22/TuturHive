import { Router } from "express";
import studentController from "../controllers/student.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/signup", studentController.signup);
router.post("/login", studentController.login);
router.post("/logout", studentController.logout);
router.get("/me", requireAuth, studentController.getMe);
router.put("/me", requireAuth, studentController.updateProfile);
router.post("/purchase", requireAuth, studentController.purchaseCourse);

export default router;


