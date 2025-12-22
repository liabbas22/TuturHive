// message.controller.js (patched)
import Message from "../models/Message.js";
import Student from "../models/Student.js";
import Tutor from "../models/Tutor.js";
import mongoose from "mongoose";

export const getConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const page = parseInt(req.query.page ?? "1", 10);
    const limit = parseInt(req.query.limit ?? "50", 10);
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    if (!otherUserId || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * limit;

    // ✅ Find conversation messages (bi-directional)
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name email role")
      .populate("receiver", "name email role");

    // ✅ Mark messages from the other user as read
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    // ✅ If the populated fields might come from either Student or Tutor model
    //    (depending on the sender/receiver role), this ensures both cases work
    const formattedMessages = messages.map((msg) => ({
      _id: msg._id,
      content: msg.content,
      messageType: msg.messageType,
      status: msg.status,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      sender: {
        _id: msg.sender?._id,
        name: msg.sender?.name || "Unknown",
        email: msg.sender?.email || "Unknown",
      },
      receiver: {
        _id: msg.receiver?._id,
        name: msg.receiver?.name || "Unknown",
        email: msg.receiver?.email || "Unknown",
      },
    }));

    res.status(200).json({
      messages: formattedMessages.reverse(), // oldest first
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit,
      },
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ message: "Failed to get conversation" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    let conversations = [];

    if (currentUserRole === "student") {
      // 🧠 Fetch student and their tutors list
      const student = await Student.findById(currentUserId).select("TutorsID");
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // 🧑‍🏫 Get tutors info
      const tutors = await Tutor.find({
        _id: { $in: student.TutorsID },
      }).select("name email");

      // 📨 For each tutor, find last message + unread count
      conversations = await Promise.all(
        tutors.map(async (tutor) => {
          const lastMsg = await Message.findOne({
            $or: [
              { sender: currentUserId, receiver: tutor._id },
              { sender: tutor._id, receiver: currentUserId },
            ],
          })
            .sort({ createdAt: -1 })
            .select("content createdAt sender receiver isRead");

          const unreadCount = await Message.countDocuments({
            sender: tutor._id,
            receiver: currentUserId,
            isRead: false,
          });

          return {
            _id: tutor._id,
            name: tutor.name,
            email: tutor.email,
            lastMessage: lastMsg ? lastMsg.content : null,
            lastMessageTime: lastMsg ? lastMsg.createdAt : null,
            unreadCount,
          };
        })
      );
    } else if (currentUserRole === "tutor") {
      // 🧠 Fetch all students who have messaged this tutor
      const studentIds = await Message.distinct("sender", {
        receiver: currentUserId,
      });

      const receiverIds = await Message.distinct("receiver", {
        sender: currentUserId,
      });

      const uniqueStudentIds = [...new Set([...studentIds, ...receiverIds])];

      const students = await Student.find({
        _id: { $in: uniqueStudentIds },
      }).select("name email");

      // 📨 For each student, find last message + unread count
      conversations = await Promise.all(
        students.map(async (student) => {
          const lastMsg = await Message.findOne({
            $or: [
              { sender: currentUserId, receiver: student._id },
              { sender: student._id, receiver: currentUserId },
            ],
          })
            .sort({ createdAt: -1 })
            .select("content createdAt sender receiver isRead");

          const unreadCount = await Message.countDocuments({
            sender: student._id,
            receiver: currentUserId,
            isRead: false,
          });

          return {
            _id: student._id,
            name: student.name,
            email: student.email,
            lastMessage: lastMsg ? lastMsg.content : null,
            lastMessageTime: lastMsg ? lastMsg.createdAt : null,
            unreadCount,
          };
        })
      );
    } else {
      return res.status(403).json({ message: "Invalid user role" });
    }

    // ✅ Sort conversations by last message time
    conversations.sort(
      (a, b) =>
        new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
    );

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Failed to get conversations" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType = "text" } = req.body;
    const senderId = req.user.id;
    const senderRole = req.user.role;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver ID" });
    }

    // Determine receiver role (opposite of sender)
    const receiverRole = senderRole === "student" ? "tutor" : "student";

    const message = new Message({
      sender: senderId,
      senderModel: senderRole === "student" ? "Student" : "Tutor",
      receiver: receiverId,
      receiverModel: receiverRole === "student" ? "Student" : "Tutor",
      content: content.trim(),
      messageType,
      status: "sent",
    });

    await message.save();

    // Populate sender and receiver details
    await message.populate([
      { path: "sender", select: "name email" },
      { path: "receiver", select: "name email" },
    ]);

    // Find recipient's socketId
    let recipient = await Student.findById(receiverId).select("socketId");
    if (!recipient) {
      recipient = await Tutor.findById(receiverId).select("socketId");
    }

    const toSocketId = recipient?.socketId;

    // Emit to recipient's direct socketId if present (legacy), and always emit to their personal room for multi-device
    try {
      if (toSocketId && toSocketId !== socket?.id) {
        global.io.to(toSocketId).emit("new_message", message);
      }
    } catch (e) {
      console.error("Error emitting to socketId:", e);
    }

    // Emit to personal room (user:<id>) so all devices receive it
    try {
      global.io.to(`user:${receiverId}`).emit("new_message", message);
      // mark delivered when we emitted to at least a room (recipient should get it)
      message.status = "delivered";
      await message.save();
    } catch (e) {
      console.error("Error emitting to user room:", e);
    }
    // Notify the sender (in case they used REST fallback) that the message was saved/delivered
    try {
      global.io.to(`user:${senderId}`).emit("message_sent", {
        _id: message._id,
        status: message.status,
        createdAt: message.createdAt,
        realId: message._id,
      });
    } catch (e) {
      console.error("Error notifying sender about saved message:", e);
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id;

    if (!otherUserId || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    await Message.markConversationAsRead(otherUserId, currentUserId);

    // Optionally notify the other user via socket that messages were read:
    global.io
      .to(`user:${otherUserId}`)
      .emit("messages_read", {
        byUserId: currentUserId,
        readAt: new Date().toISOString(),
      });

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const unreadCount = await Message.getUnreadCount(currentUserId);

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};

export const getRecentMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const limit = parseInt(req.query.limit ?? "10", 10);

    const recentMessages = await Message.find({
      receiver: currentUserId,
      isRead: false,
    })
      .populate("sender", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({ messages: recentMessages });
  } catch (error) {
    console.error("Get recent messages error:", error);
    res.status(500).json({ message: "Failed to get recent messages" });
  }
};

export default {
  getConversation,
  getConversations,
  sendMessage,
  markAsRead,
  getUnreadCount,
  getRecentMessages,
};
