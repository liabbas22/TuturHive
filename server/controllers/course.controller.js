import courseService from "../services/course.service.js";
import Tutor from "../models/Tutor.js";

const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, format } = req.body;
    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: "Invalid data" });
    }
    if (!req.user || req.user.role !== 'tutor') {
      return res.status(403).json({ message: "Only tutors can create courses" });
    }
    // Collect media from uploads: multiple images and single video
    let imageUrl = undefined;
    let imageUrls = undefined;
    let videoUrl = undefined;
    if (req.files) {
      // Multer fields mode
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [];
      const legacyImage = Array.isArray(req.files.image) ? req.files.image : [];
      const videoFiles = Array.isArray(req.files.video) ? req.files.video : [];
      const mappedImages = imageFiles.map((f) => `/api/uploads/${f.filename}`);
      const mappedLegacy = legacyImage.map((f) => `/api/uploads/${f.filename}`);
      const combinedImages = [...mappedLegacy, ...mappedImages];
      if (combinedImages.length === 1) {
        imageUrl = combinedImages[0];
      } else if (combinedImages.length > 1) {
        imageUrls = combinedImages;
      }
      if (videoFiles.length > 0) {
        videoUrl = `/api/uploads/${videoFiles[0].filename}`;
      }
    } else if (req.file) {
      // Single file (legacy)
      imageUrl = `/api/uploads/${req.file.filename}`;
    }

    const course = await courseService.createCourseService({
      title,
      description,
      price,
      imageUrl,
      imageUrls,
      videoUrl,
      category,
      format,
      tutor: req.user.id,
    });
    await Tutor.findByIdAndUpdate(req.user.id, { $push: { courses: course._id } });
    res.status(201).json({ course });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const listCourses = async (_req, res) => {
  try {
    const courses = await courseService.listCoursesService();
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseByIdService(id);
    res.status(200).json({ course });
  } catch (err) {
    if (err.message === "Course not found") {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const courseController = {
  createCourse,
  listCourses,
  getCourseById,
};

export default courseController;