import bcrypt from "bcryptjs";
import Student from "../models/Student.js";

export const createStudent = async ({ name, email, password }) => {
  const existing = await Student.findOne({ email });
  if (existing) throw new Error("Email already registered");
  const hashed = await bcrypt.hash(password, 10);
  const student = await Student.create({ name, email, password: hashed, role: "student" });
  return student;
};

export const authenticateStudent = async ({ email, password }) => {
  const student = await Student.findOne({ email });
  if (!student) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, student.password);
  if (!ok) throw new Error("Invalid credentials");
  return student;
};

export default { createStudent, authenticateStudent };


