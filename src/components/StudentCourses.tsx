import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const StudentCourses: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user?.purchasedCourses) {
      setPurchasedCourses(user.purchasedCourses);
    } else {
      setPurchasedCourses([]);
    }
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide font-merienda">
          My Courses
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {purchasedCourses.map((course) => {
            let imgSrc = "";
            if (course.imageUrl) {
              imgSrc = course.imageUrl.startsWith("http")
                ? course.imageUrl
                : `${backendUrl}${course.imageUrl}`;
            } else if (course.imageUrls?.length > 0) {
              imgSrc = course.imageUrls[0].startsWith("http")
                ? course.imageUrls[0]
                : `${backendUrl}${course.imageUrls[0]}`;
            }

            return (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md"
              >
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>

                  <p className="hidden lg:block text-gray-700 mb-4 text-sm">
                    {course.description}
                  </p>

                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <span className="text-emerald-600 font-semibold">
                      Purchased
                    </span>

                    {course.driveLink ? (
                      <a
                        href={course.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Drive
                      </a>
                    ) : (
                      <button
                        disabled
                        className="rounded-lg bg-gray-400 px-4 py-2 text-sm text-white"
                      >
                        No Materials
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {purchasedCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            You haven't purchased any courses yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
