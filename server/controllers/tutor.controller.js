import { createTutor, authenticateTutor } from "../services/tutor.service.js";
import { generateJwt, setAuthCookie, clearAuthCookie } from "../utils/generateToken.js";
import Tutor from "../models/Tutor.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
    const tutor = await createTutor({ name, email, password });
    const token = generateJwt({ id: tutor._id, role: "tutor" });
    setAuthCookie(res, token);
    res.status(201).json({ user: { id: tutor._id, name: tutor.name, email: tutor.email, role: "tutor" } });
  } catch (e) {
    res.status(400).json({ message: e.message || "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });
    const tutor = await authenticateTutor({ email, password });
    const token = generateJwt({ id: tutor._id, role: "tutor" });
    setAuthCookie(res, token);
    res.status(200).json({ user: { id: tutor._id, name: tutor.name, email: tutor.email, role: "tutor" } });
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
    const t = await Tutor.findById(id).select("_id name email role bio expertise");
    if (!t) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ user: { id: t._id, name: t.name, email: t.email, role: t.role, bio: t.bio, expertise: t.expertise } });
  } catch (e) {
    res.status(500).json({ message: "Failed to load user" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: "Unauthorized" });
    const { name, bio, expertise } = req.body;
    const t = await Tutor.findByIdAndUpdate(
      id,
      { $set: { ...(name !== undefined ? { name } : {}), ...(bio !== undefined ? { bio } : {}), ...(expertise !== undefined ? { expertise } : {}) } },
      { new: true }
    ).select("_id name email role bio expertise");
    res.status(200).json({ user: { id: t._id, name: t.name, email: t.email, role: t.role, bio: t.bio, expertise: t.expertise } });
  } catch (e) {
    res.status(400).json({ message: "Update failed" });
  }
};

export default { signup, login, logout, getMe, updateProfile };


