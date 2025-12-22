import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    interests: { type: String, default: "" },
    bio: { type: String, default: "" },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    TutorsID: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tutor" }],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
