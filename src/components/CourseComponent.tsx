import React from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useCourses } from "../contexts/courseContext";
import type { Course } from "../apis/course";

type Props = {
  course: Course;
  showDeleteButton?: boolean;
};

const CourseComponent: React.FC<Props> = ({
  course,
  showDeleteButton = false,
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const primaryImage = course.imageUrls?.[0] || course.imageUrl;

  const imageSrc = primaryImage
    ? primaryImage.startsWith("http")
      ? primaryImage
      : `${backendUrl}${primaryImage}`
    : null;

  const { user } = useAuth();
  const { deleteCourse } = useCourses();

  const canDelete = showDeleteButton && user?.role === "tutor";

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-800">
            Are you sure you want to delete this course?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await deleteCourse(course._id);
                  toast.success("Course deleted successfully");
                } catch (error) {
                  toast.error("Failed to delete course");
                }
                closeToast();
              }}
              className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600 transition"
            >
              Yes, Delete
            </button>

            <button
              onClick={closeToast}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return (
    <div
      className="h-full group overflow-hidden rounded-xl bg-white transition-all duration-300
   relative "
    >
      <Link to={`/course/${course._id}`} className="relative block">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={course.title}
            className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-60 items-center justify-center bg-gray-100 text-gray-400">
            No Image Available
          </div>
        )}
      </Link>

      <div className="py-4 px-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-merienda text-gray-900 font-medium">
            {course.title}
          </h3>

          <div className="absolute top-2 right-2 flex items-center gap-1">
            {course.category && (
              <span className="rounded-full bg-gray-900/80 px-3 py-1 text-[8px] sm:text-xs font-semibold text-white shadow-md backdrop-blur">
                {course.category}
              </span>
            )}

            {course.format && (
              <span
                className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold tracking-wide shadow-md ${
                  course.format === "formal"
                    ? "bg-blue-600/90 text-white"
                    : "bg-emerald-600/90 text-white"
                }`}
              >
                {course.format === "formal" ? "Formal" : "Informal"}
              </span>
            )}
          </div>
        </div>


        <p className="mb-4 line-clamp-3  text-gray-600 tracking-wider font-playDEGrund text-[12px]">
          {course.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xl font-bold text-yellow-600 font-merienda">
            ${course.price}
          </span>

          <div className="flex items-center gap-2 font-merienda">
            <Link
              to={`/course/${course._id}`}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-yellow-700 transition"
            >
              Learn More
            </Link>

            {user?.role !== "tutor" && (
              <Link
                to={`/purchase/${course._id}`}
                state={{
                  course: {
                    _id: course._id,
                    title: course.title,
                    tutor:
                      typeof course.tutor === "object"
                        ? course.tutor?.name
                        : course.tutor || "Tutor",
                    price: course.price,
                    image: imageSrc || "",
                    description: course.description,
                  },
                }}
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-yellow-600 transition"
              >
                Buy Now
              </Link>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                title="Delete course"
                className="rounded-lg bg-red-500 p-2 text-white shadow hover:bg-red-600 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseComponent;
