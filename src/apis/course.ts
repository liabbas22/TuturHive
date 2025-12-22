export type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  tutor?: { _id: string; name: string; email: string } | string;
  category?: string;
  format?: "formal" | "informal";
  driveLink?: string;
  createdAt?: string;
  updatedAt?: string;
  sections?: number;
  lectures?: number;
  duration?: string;
  language?: string;
  ratings?: number;
  ratingsCount?: number;
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${API_BASE_URL}/api/course/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch courses (${res.status})`);
  const data = await res.json();
  return data.courses as Course[];
};

export const createCourse = async (
  course: Omit<Course, "_id"> & {
    imageFiles?: File[];
    videoFile?: File | null;
    imageFile?: File | null;
  }
): Promise<Course> => {
  const hasAnyFile =
    Boolean(course.imageFiles?.length) ||
    Boolean(course.videoFile) ||
    Boolean(course.imageFile);
  const url = `${API_BASE_URL}/api/course/create`;
  let res: Response;

  if (hasAnyFile) {
    const form = new FormData();
    form.append("title", course.title);
    form.append("description", course.description);
    form.append("price", String(course.price));
    if (course.category) form.append("category", course.category);
    if (course.format) form.append("format", course.format);
    if (course.driveLink) form.append("driveLink", course.driveLink);
    if (course.sections !== undefined)
      form.append("sections", String(course.sections));
    if (course.lectures !== undefined)
      form.append("lectures", String(course.lectures));
    if (course.language) form.append("language", course.language);
    if (course.duration) form.append("duration", course.duration);
    if (course.ratings !== undefined)
      form.append("ratings", String(course.ratings));
    if (course.ratingsCount !== undefined)
      form.append("ratingsCount", String(course.ratingsCount));

    if (course.imageFiles && course.imageFiles.length > 0) {
      course.imageFiles.forEach((f) => form.append("images", f));
    }
    if (!course.imageFiles?.length && course.imageFile) {
      form.append("image", course.imageFile);
    }
    if (course.videoFile) form.append("video", course.videoFile);

    res = await fetch(url, {
      method: "POST",
      body: form,
      credentials: "include",
    });
  } else {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category,
        format: course.format,
        driveLink: course.driveLink,
        sections: course.sections,
        lectures: course.lectures,
        language: course.language,
        duration: course.duration,
        ratings: course.ratings,
        ratingsCount: course.ratingsCount,
      }),
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
  const res = await fetch(`${API_BASE_URL}/api/course/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Course not found");
    throw new Error(`Failed to fetch course (${res.status})`);
  }
  const data = await res.json();
  return data.course as Course;
};

export const deleteCourse = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/api/course/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Course not found");
    if (res.status === 403)
      throw new Error("You don't have permission to delete this course");
    throw new Error(`Failed to delete course (${res.status})`);
  }
};

const courseApi = { fetchCourses, createCourse, fetchCourseById, deleteCourse };
export default courseApi;
