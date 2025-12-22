import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import courseApi, { Course } from "../apis/course";

type CourseInput = Omit<Course, "_id"> & {
  imageFiles?: File[];
  imageFile?: File | null;
  videoFile?: File | null;
};

type CourseContextValue = {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addCourse: (input: CourseInput) => Promise<Course>;
  getCourseById: (id: string) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
};

const CourseContext = createContext<CourseContextValue | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseApi.fetchCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCourse = useCallback(async (input: CourseInput) => {
    try {
      const created = await courseApi.createCourse(input);
      setCourses((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err?.message ?? "Failed to add course");
      throw err;
    }
  }, []);

  const getCourseById = useCallback(async (id: string) => {
    try {
      return await courseApi.fetchCourseById(id);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch course");
      throw err;
    }
  }, []);

  const deleteCourse = useCallback(async (id: string) => {
    try {
      await courseApi.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete course");
      throw err;
    }
  }, []);

  const value = useMemo<CourseContextValue>(
    () => ({
      courses,
      isLoading,
      error,
      refresh,
      addCourse,
      getCourseById,
      deleteCourse,
    }),
    [courses, isLoading, error, refresh, addCourse, getCourseById, deleteCourse]
  );

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = (): CourseContextValue => {
  const ctx = useContext(CourseContext);
  if (!ctx) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return ctx;
};

export default CourseContext;
