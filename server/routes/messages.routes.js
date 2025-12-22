import { Router } from "express";
import messageController from "../controllers/message.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// Get conversation between current user and another user
router.get("/conversation/:otherUserId", requireAuth, messageController.getConversation);

// Get all conversations for current user
router.get("/conversations", requireAuth, messageController.getConversations);

// Send a new message
router.post("/send", requireAuth, messageController.sendMessage);

// Mark conversation as read
router.put("/conversation/:otherUserId/read", requireAuth, messageController.markAsRead);

// Get unread message count
router.get("/unread-count", requireAuth, messageController.getUnreadCount);

// Get recent messages for notifications
router.get("/recent", requireAuth, messageController.getRecentMessages);

export default router;
