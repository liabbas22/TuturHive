import { Router } from "express";
import tutorController from "../controllers/tutor.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/signup", tutorController.signup);
router.post("/login", tutorController.login);
router.post("/logout", tutorController.logout);
router.get("/me", requireAuth, tutorController.getMe);
router.put("/me", requireAuth, tutorController.updateProfile);

export default router;


