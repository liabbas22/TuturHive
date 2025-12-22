import React, { useMemo, useState } from "react";
import { useCourses } from "../contexts/courseContext";
import CourseComponent from "../components/CourseComponent";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<"all" | "formal" | "informal">("all");

  const { courses, isLoading, error } = useCourses();

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["all", ...Array.from(set).sort()];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return courses.filter((course) => {
      const matchesText =
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;

      const matchesFormat =
        selectedFormat === "all" || course.format === selectedFormat;

      return matchesText && matchesCategory && matchesFormat;
    });
  }, [courses, searchTerm, selectedCategory, selectedFormat]);

  return (
    <main className="min-h-screen bg-gray-50 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-merienda tracking-wide font-extrabold text-gray-900"
          >
            Explore Courses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-4 text-md sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-playDEGrund tracking-wide"
          >
            Discover high-quality courses created by expert tutors to help you grow your skills.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-10 rounded-xl bg-white p-6 shadow-md"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm sm:text-base focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm sm:text-base focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedFormat}
                onChange={(e) =>
                  setSelectedFormat(e.target.value as "all" | "formal" | "informal")
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm sm:text-base focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              >
                <option value="all">All Formats</option>
                <option value="formal">Formal</option>
                <option value="informal">Informal</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-16 flex flex-col items-center gap-3"
          >
            <span className="h-6 w-6 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
            <span className="text-lg sm:text-xl text-gray-600">Loading courses…</span>
          </motion.div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-16 text-center text-red-600 text-lg"
          >
            {toast.error(error)}
          </motion.div>
        )}

        {/* Courses */}
        {!isLoading && filteredCourses.length > 0 && (
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredCourses.map((course) => (
                <motion.div
                  key={course._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <CourseComponent course={course} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* No Courses */}
        {!isLoading && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-20 text-center"
          >
            <p className="text-lg sm:text-xl text-gray-500">
              No courses found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default CoursesPage;
