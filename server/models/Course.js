import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    imageUrl: {
      type: String,
      trim: true,
      default: undefined,
    },

    imageUrls: {
      type: [String],
      default: undefined,
    },

    videoUrl: {
      type: String,
      trim: true,
      default: undefined,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
      index: true,
    },

    category: {
      type: String,
      trim: true,
      default: undefined,
      index: true,
    },

    format: {
      type: String,
      enum: ["formal", "informal"],
      default: "formal",
    },

    driveLink: {
      type: String,
      trim: true,
      default: undefined,
    },

    sections: {
      type: Number,
      min: 1,
      default: 1,
      set: (v) => (Number(v) > 0 ? Number(v) : 1),
    },

    lectures: {
      type: Number,
      min: 1,
      default: 1,
      set: (v) => (Number(v) > 0 ? Number(v) : 1),
    },

    duration: {
      type: String,
      default: "0h 0m",
    },

    language: {
      type: String,
      default: "English",
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Course", courseSchema);
