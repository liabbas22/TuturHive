import courseService from "../services/course.service.js";
import Tutor from "../models/Tutor.js";

const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      format,
      driveLink,
      sections,
      lectures,
      duration,
      language,
      ratings,
      ratingsCount,
    } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: "Invalid data" });
    }

    if (!req.user || req.user.role !== "tutor") {
      return res.status(403).json({ message: "Only tutors can create courses" });
    }

    // Ensure sections and lectures are numbers and set defaults
    const safeSections = Number(sections) > 0 ? Number(sections) : 1;
    const safeLectures = Number(lectures) > 0 ? Number(lectures) : 1;

    let imageUrl;
    let imageUrls;
    let videoUrl;

    if (req.files) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [];
      const legacyImage = Array.isArray(req.files.image) ? req.files.image : [];
      const videoFiles = Array.isArray(req.files.video) ? req.files.video : [];

      const mappedImages = imageFiles.map(f => `/api/uploads/${f.filename}`);
      const mappedLegacy = legacyImage.map(f => `/api/uploads/${f.filename}`);
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
      driveLink,
      tutor: req.user.id,
      sections: safeSections,
      lectures: safeLectures,
      duration: duration || "0h 0m",
      language: language || "English",
      ratings: ratings || 0,
      ratingsCount: ratingsCount || 0,
    });

    await Tutor.findByIdAndUpdate(
      req.user.id,
      { $push: { courses: course._id } },
      { new: true }
    );

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

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || req.user.role !== 'tutor') {
      return res.status(403).json({ message: "Only tutors can delete courses" });
    }

    const result = await courseService.deleteCourseService(id, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "Course not found") {
      return res.status(404).json({ message: "Course not found" });
    }
    if (err.message === "You don't have permission to delete this course") {
      return res.status(403).json({ message: "You don't have permission to delete this course" });
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
  deleteCourse,
};

export default courseController;
