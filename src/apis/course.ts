export type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  category?: string;
  format?: "formal" | "informal";
  tutor?: { _id: string; name: string; email: string } | string;
  createdAt?: string;
  updatedAt?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const fetchCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${API_BASE_URL}/course/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch courses (${res.status})`);
  }
  const data = await res.json();
  return data.courses as Course[];
};

export const createCourse = async (
  course: Omit<Course, "_id"> & { imageFiles?: File[]; videoFile?: File | null; imageFile?: File | null }
): Promise<Course> => {
  const hasAnyFile = Boolean(course.imageFiles?.length) || Boolean(course.videoFile) || Boolean(course.imageFile);
  const url = `${API_BASE_URL}/course/create`;
  let res: Response;

  if (hasAnyFile) {
    const form = new FormData();
    form.append("title", course.title);
    form.append("description", course.description);
    form.append("price", String(course.price));
    if (course.category) form.append("category", course.category);
    if (course.format) form.append("format", course.format);
    // New fields
    if (course.imageFiles && course.imageFiles.length > 0) {
      course.imageFiles.forEach((f) => form.append("images", f));
    }
    if (!course.imageFiles?.length && course.imageFile) {
      // legacy single image
      form.append("image", course.imageFile);
    }
    if (course.videoFile) form.append("video", course.videoFile);
    res = await fetch(url, { method: "POST", body: form, credentials: "include" });
  } else {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: course.title, description: course.description, price: course.price, category: course.category, format: course.format }),
    });
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create course (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.course as Course;
};

export const fetchCourseById = async (id: string): Promise<Course> => {
  const res = await fetch(`${API_BASE_URL}/course/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Course not found");
    }
    throw new Error(`Failed to fetch course (${res.status})`);
  }
  const data = await res.json();
  return data.course as Course;
};

const courseApi = { fetchCourses, createCourse, fetchCourseById };
export default courseApi;

