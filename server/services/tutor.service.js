import bcrypt from "bcryptjs";
import Tutor from "../models/Tutor.js";

export const createTutor = async ({ name, email, password }) => {
  const existing = await Tutor.findOne({ email });
  if (existing) throw new Error("Email already registered");
  const hashed = await bcrypt.hash(password, 10);
  const tutor = await Tutor.create({ name, email, password: hashed, role: "tutor" });
  return tutor;
};

export const authenticateTutor = async ({ email, password }) => {
  const tutor = await Tutor.findOne({ email });
  if (!tutor) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, tutor.password);
  if (!ok) throw new Error("Invalid credentials");
  return tutor;
};

export default { createTutor, authenticateTutor };


