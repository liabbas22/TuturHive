import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import courseApi, { Course } from "../apis/course";

type CourseContextValue = {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addCourse: (
    input: Omit<Course, "_id"> & { imageFiles?: File[]; videoFile?: File | null; imageFile?: File | null }
  ) => Promise<Course>;
  getCourseById: (id: string) => Promise<Course>;
};

const CourseContext = createContext<CourseContextValue | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
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
    load();
  }, [load]);

  const addCourse = useCallback(async (
    input: Omit<Course, "_id"> & { imageFiles?: File[]; videoFile?: File | null; imageFile?: File | null }
  ) => {
    const created = await courseApi.createCourse(input);
    setCourses(prev => [created, ...prev]);
    return created;
  }, []);

  const getCourseById = useCallback(async (id: string) => {
    return await courseApi.fetchCourseById(id);
  }, []);

  const value = useMemo<CourseContextValue>(() => ({ courses, isLoading, error, refresh: load, addCourse, getCourseById }), [courses, isLoading, error, load, addCourse, getCourseById]);

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourses = (): CourseContextValue => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourses must be used within a CourseProvider");
  return ctx;
};

export default CourseContext;

