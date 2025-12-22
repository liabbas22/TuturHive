import Course from "../models/Course.js";

export const createCourseService = async ({
  title,
  description,
  price,
  imageUrl,
  imageUrls,
  videoUrl,
  category,
  format,
  driveLink,
  tutor,
  sections,
  lectures,
  duration,
  language,
  ratings,
  ratingsCount,
}) => {
  const course = new Course({
    title,
    description,
    price,
    imageUrl,
    imageUrls,
    videoUrl,
    category,
    format,
    driveLink,
    tutor,
    sections,
    lectures,
    duration,
    language,
    ratings,
    ratingsCount,
  });

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

export const deleteCourseService = async (courseId, tutorId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  
  // Check if the course belongs to the tutor
  if (course.tutor.toString() !== tutorId) {
    throw new Error("You don't have permission to delete this course");
  }
  
  await Course.findByIdAndDelete(courseId);
  return { message: "Course deleted successfully" };
};

const courseService = {
  createCourseService,
  listCoursesService,
  getCourseByIdService,
  deleteCourseService,
};

export default courseService;
