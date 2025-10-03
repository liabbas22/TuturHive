import { createStudent, authenticateStudent } from "../services/student.service.js";
import { generateJwt, setAuthCookie, clearAuthCookie } from "../utils/generateToken.js";
import Student from "../models/Student.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
    const student = await createStudent({ name, email, password });
    const token = generateJwt({ id: student._id, role: "student" });
    setAuthCookie(res, token);
    res.status(201).json({ user: { id: student._id, name: student.name, email: student.email, role: "student" } });
  } catch (e) {
    res.status(400).json({ message: e.message || "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });
    const student = await authenticateStudent({ email, password });
    const token = generateJwt({ id: student._id, role: "student" });
    setAuthCookie(res, token);
    res.status(200).json({ user: { id: student._id, name: student.name, email: student.email, role: "student" } });
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
      .select("_id name email role interests bio purchasedCourses")
      .populate({
        path: "purchasedCourses",
        select: "title description price imageUrl category format tutor createdAt",
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
      { $set: { ...(name !== undefined ? { name } : {}), ...(interests !== undefined ? { interests } : {}), ...(bio !== undefined ? { bio } : {}) } },
      { new: true }
    )
      .select("_id name email role interests bio purchasedCourses")
      .populate({
        path: "purchasedCourses",
        select: "title description price imageUrl category format tutor createdAt",
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
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: "Unauthorized" });
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: "Missing courseId" });
    const s = await Student.findByIdAndUpdate(
      id,
      { $addToSet: { purchasedCourses: courseId } },
      { new: true }
    ).populate({ path: 'purchasedCourses', options: { sort: { createdAt: -1 } } });
    res.status(200).json({ purchased: s.purchasedCourses });
  } catch (e) {
    res.status(400).json({ message: "Purchase failed" });
  }
};

export default { signup, login, logout, getMe, updateProfile, purchaseCourse };


