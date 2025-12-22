import {
  createStudent,
  authenticateStudent,
} from "../services/student.service.js";
import {
  generateJwt,
  setAuthCookie,
  clearAuthCookie,
} from "../utils/generateToken.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const student = await createStudent({ name, email, password });
    const token = generateJwt({ id: student._id, role: "student" });
    setAuthCookie(res, token);
    res
      .status(201)
      .json({
        user: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: "student",
        },
      });
  } catch (e) {
    res.status(400).json({ message: e.message || "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const student = await authenticateStudent({ email, password });
    const token = generateJwt({ id: student._id, role: "student" });
    setAuthCookie(res, token);
    res
      .status(200)
      .json({
        user: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: "student",
        },
      });
  } catch (e) {
    res.status(401).json({ message: e.message || "Login failed" });
  }
};

export const logout = async (_req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: "Unauthorized" });
    const s = await Student.findById(id)
      .select("_id name email role interests bio purchasedCourses chatContacts")
      .populate({
        path: "purchasedCourses",
        select:
          "title description price imageUrl category format tutor createdAt",
        populate: {
          path: "tutor",
          select: "name email",
        },
        options: { sort: { createdAt: -1 } },
      });
    if (!s) return res.status(404).json({ message: "Not found" });
    res.status(200).json({
      user: {
        id: s._id,
        name: s.name,
        email: s.email,
        role: s.role,
        interests: s.interests,
        bio: s.bio,
        purchasedCourses: s.purchasedCourses ?? [],
        chatContacts: s.chatContacts ?? [],
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to load user" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: "Unauthorized" });
    const { name, interests, bio } = req.body;
    const s = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name !== undefined ? { name } : {}),
          ...(interests !== undefined ? { interests } : {}),
          ...(bio !== undefined ? { bio } : {}),
        },
      },
      { new: true }
    )
      .select("_id name email role interests bio purchasedCourses")
      .populate({
        path: "purchasedCourses",
        select:
          "title description price imageUrl category format tutor createdAt",
        populate: {
          path: "tutor",
          select: "name email",
        },
        options: { sort: { createdAt: -1 } },
      });
    res.status(200).json({
      user: {
        id: s._id,
        name: s.name,
        email: s.email,
        role: s.role,
        interests: s.interests,
        bio: s.bio,
        purchasedCourses: s.purchasedCourses ?? [],
      },
    });
  } catch (e) {
    res.status(400).json({ message: "Update failed" });
  }
};

export const purchaseCourse = async (req, res) => {
  try {
    console.log("Purchase request received:", req.body);
    console.log("User ID:", req.user?.id);

    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: "Unauthorized" });

    const { courseId, paymentMethod, transactionId, amount } = req.body;
    if (!courseId) return res.status(400).json({ message: "Missing courseId" });
    if (!paymentMethod)
      return res.status(400).json({ message: "Missing payment method" });
    if (!transactionId)
      return res.status(400).json({ message: "Missing transaction ID" });
    if (!amount) return res.status(400).json({ message: "Missing amount" });

    const Course = (await import("../models/Course.js")).default;
    const Student = (await import("../models/Student.js")).default;
    const mongoose = (await import("mongoose")).default;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "User not found" });

    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // Check if already purchased
    if (
      student.purchasedCourses.some(
        (c) => c.toString() === courseObjectId.toString()
      )
    ) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    // ✅ Get Tutor ID safely
    const tutorId = course.tutor?._id || course.tutor;

    if (tutorId && mongoose.Types.ObjectId.isValid(tutorId)) {
      // ✅ Add tutorId to TutorsID array if not already added
      await Student.findByIdAndUpdate(id, {
        $addToSet: { TutorsID: tutorId },
      });
    } else {
      console.warn("Invalid tutor ID, skipping TutorsID update:", tutorId);
    }

    // ✅ Add course to purchasedCourses
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $addToSet: { purchasedCourses: courseObjectId } },
      { new: true }
    ).populate({
      path: "purchasedCourses",
      select:
        "title description price imageUrl imageUrls videoUrl category format driveLink tutor createdAt",
      populate: {
        path: "tutor",
        select: "name email",
      },
      options: { sort: { createdAt: -1 } },
    });

    // ✅ Optional: send drive link to student email
    try {
      if (student.email && course.driveLink) {
        const sendEmail = (await import("../utils/sendEmail.js")).default;
        await sendEmail({
          to: student.email,
          subject: `Access to Course: ${course.title}`,
          text: `Thank you for purchasing the course '${course.title}'.\n\nAccess your course materials here: ${course.driveLink}`,
          html: `<p>Thank you for purchasing the course <b>${course.title}</b>.</p><p>Access your course materials here: <a href='${course.driveLink}'>${course.driveLink}</a></p>`,
        });
      }
    } catch (emailErr) {
      console.warn("Failed to send drive link email:", emailErr?.message);
    }

    res.status(200).json({
      message: "Purchase successful",
      course,
      purchasedCourses: updatedStudent.purchasedCourses,
    });
  } catch (e) {
    console.error("Purchase error:", e);
    res.status(400).json({ message: "Purchase failed", error: e.message });
  }
};

export default { signup, login, logout, getMe, updateProfile, purchaseCourse };
