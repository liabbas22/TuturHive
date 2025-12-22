import React, { useMemo, useState } from "react";
import TutorSidebar from "../components/TutorSidebar";
import TutorProfile from "../components/TutorProfile";
import TutorAddCourse from "../components/TutorAddCourse";
import TutorMessages from "../components/TutorMessages";
import { useCourses } from "../contexts/courseContext";
import CourseComponent from "../components/CourseComponent";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const TutorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { courses, isLoading, error } = useCourses();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<
    "all" | "formal" | "informal"
  >("all");

  const ownCourses = useMemo(() => {
    if (!user) return [] as any[];
    return courses.filter((c) => {
      const tutorId =
        typeof c.tutor === "string" ? c.tutor : (c.tutor as any)?._id;
      return tutorId === user.id;
    });
  }, [courses, user]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    ownCourses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["all", ...Array.from(set).sort()];
  }, [ownCourses]);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return ownCourses.filter((course) => {
      const matchesText =
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term);
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      const matchesFormat =
        selectedFormat === "all" || course.format === selectedFormat;
      return matchesText && matchesCategory && matchesFormat;
    });
  }, [ownCourses, searchTerm, selectedCategory, selectedFormat]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <TutorProfile />;

      case "courses":
        return (
          <section className="w-full">
            <div className="mb-8 bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-2">
                  <label className="sr-only">Search courses</label>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800
                    placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="sr-only">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800
                    focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="sr-only">Format</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800
                    focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="all">All Formats</option>
                    <option value="formal">Formal</option>
                    <option value="informal">Informal</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center py-20 text-gray-600 text-sm"
              >
                Loading courses...
              </motion.div>
            )}

            {error && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center py-20 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {!isLoading && !error && filteredCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <p className="text-gray-500 text-base sm:text-lg">
                  No courses found matching your criteria.
                </p>
              </motion.div>
            )}

            {!isLoading && !error && filteredCourses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredCourses.map((course) => (
                  <CourseComponent
                    key={(course as any)._id}
                    course={course as any}
                    showDeleteButton={true}
                  />
                ))}
              </motion.div>
            )}
          </section>
        );

      case "add-course":
        return <TutorAddCourse onCancel={() => setActiveTab("courses")} />;

      case "messages":
        return <TutorMessages />;

      default:
        return <TutorProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <div className="flex-shrink-0">
        <TutorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TutorDashboard;
