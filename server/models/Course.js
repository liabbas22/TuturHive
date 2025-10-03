import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      // 'trim' is not a valid option for Number type, so remove it
    },
  // Legacy single imageUrl kept for backward compatibility
  imageUrl: {
    type: String,
    required: false,
    trim: true,
  },
  // New: support multiple images
  imageUrls: {
    type: [String],
    required: false,
    default: undefined,
  },
  // New: optional course video
  videoUrl: {
    type: String,
    required: false,
    trim: true,
  },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: false,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
    format: {
      type: String,
      required: false,
      enum: ["formal", "informal"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
