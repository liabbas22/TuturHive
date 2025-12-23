import courseService from "../services/course.service.js";
import Tutor from "../models/Tutor.js";

const createCourse = async (req, res) => {
  try {
    if (req.user.role !== "tutor")
      return res.status(403).json({ message: "Only tutors allowed" });

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
    } = req.body;

    let imageUrl, imageUrls, videoUrl;

    if (req.files) {
      const images = [...(req.files.image || []), ...(req.files.images || [])];

      if (images.length === 1)
        imageUrl = `/api/uploads/${images[0].filename}`;
      if (images.length > 1)
        imageUrls = images.map(f => `/api/uploads/${f.filename}`);

      if (req.files.video?.[0])
        videoUrl = `/api/uploads/${req.files.video[0].filename}`;
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
      sections: Number(sections) || 1,
      lectures: Number(lectures) || 1,
      duration: duration || "0h 0m",
      language: language || "English",
    });

    await Tutor.findByIdAndUpdate(req.user.id, {
      $push: { courses: course._id },
    });

    res.status(201).json({ course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listCourses = async (_req, res) => {
  const courses = await courseService.listCoursesService();
  res.json({ courses });
};

const getCourseById = async (req, res) => {
  const course = await courseService.getCourseByIdService(req.params.id);
  if (!course) return res.status(404).json({ message: "Not found" });
  res.json({ course });
};

const deleteCourse = async (req, res) => {
  if (req.user.role !== "tutor")
    return res.status(403).json({ message: "Forbidden" });

  const result = await courseService.deleteCourseService(
    req.params.id,
    req.user.id
  );
  res.json(result);
};

export default {
  createCourse,
  listCourses,
  getCourseById,
  deleteCourse,
};
