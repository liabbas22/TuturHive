import Course from "../models/Course.js";

export const createCourseService = async ({ title, description, price, imageUrl, imageUrls, videoUrl, category, format, tutor }) => {
  const course = new Course({ title, description, price, imageUrl, imageUrls, videoUrl, category, format, tutor });
  await course.save();
  return course;
};

export const listCoursesService = async () => {
  const courses = await Course.find({}).sort({ createdAt: -1 }).populate("tutor", "_id name email");
  return courses;
};

export const getCourseByIdService = async (courseId) => {
  const course = await Course.findById(courseId).populate("tutor", "_id name email");
  if (!course) {
    throw new Error("Course not found");
  }
  return course;
};

const courseService = {
  createCourseService,
  listCoursesService,
  getCourseByIdService,
};

export default courseService;
