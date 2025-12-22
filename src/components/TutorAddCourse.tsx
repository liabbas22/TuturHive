import React, { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useCourses } from "../contexts/courseContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

interface TutorAddCourseProps {
  onCancel: () => void;
}

const TutorAddCourse: React.FC<TutorAddCourseProps> = ({ onCancel }) => {
  const { addCourse } = useCourses();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    format: "",
    price: "",
    driveLink: "",
    sections: 1,
    lectures: 1,
    language: "English",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await addCourse({
        ...formData,
        price: Number(formData.price),
        sections: Number(formData.sections),
        lectures: Number(formData.lectures),
        imageFiles,
        videoFile,
      } as any);

      onCancel();
      toast.success("New Course Added Successfully!");
    } catch (err: any) {
      setError(err?.message ?? "Failed to add course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageDrop = (files: File[]) => {
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    setGalleryPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleVideoDrop = (file: File) => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-merienda">
          Add New Course
        </h1>
        <p className="text-gray-600 mt-1 font-playDEGrund text-[14px]">
          Create professional content for your students
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {["sections", "lectures"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                {field}
              </label>
              <input
                type="number"
                min={1}
                value={(formData as any)[field]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field]: Number(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
                required
                disabled={submitting}
              />
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
            disabled={submitting}
          >
            {[
              "English",
              "Spanish",
              "French",
              "German",
              "Chinese",
              "Hindi",
              "Arabic",
              "Other",
            ].map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </select>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-sm"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.25 }}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-yellow-500 transition"
          onClick={() => imageInputRef.current?.click()}
        >
          <Plus className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <p className="font-semibold text-gray-900">Upload Course Images</p>
          <p className="text-sm text-gray-500 mt-1">
            Click or drag & drop images
          </p>
          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={submitting}
            onChange={(e) => {
              if (!e.target.files) return;
              handleImageDrop(Array.from(e.target.files));
              e.currentTarget.value = "";
            }}
          />
        </motion.div>

        <AnimatePresence>
          {galleryPreviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {galleryPreviews.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={src}
                    className="h-24 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(src);
                      setGalleryPreviews((p) => p.filter((_, x) => x !== i));
                      setImageFiles((p) => p.filter((_, x) => x !== i));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.25 }}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-yellow-500 transition"
          onClick={() => videoInputRef.current?.click()}
        >
          {!videoPreview ? (
            <>
              <Plus className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <p className="font-semibold text-gray-900">Upload Course Video</p>
              <p className="text-sm text-gray-500 mt-1">Click or drag & drop video</p>
            </>
          ) : (
            <div>
              <video
                src={videoPreview}
                controls
                className="w-full max-w-xl rounded mb-2"
              />
              <button
                type="button"
                onClick={() => {
                  if (videoPreview) URL.revokeObjectURL(videoPreview);
                  setVideoPreview(null);
                  setVideoFile(null);
                }}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Remove Video
              </button>
            </div>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) handleVideoDrop(file);
              e.currentTarget.value = "";
            }}
          />
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["title", "price"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                {field}
              </label>
              <input
                value={(formData as any)[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
                required
                disabled={submitting}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Format
            </label>
            <select
              value={formData.format}
              onChange={(e) =>
                setFormData({ ...formData, format: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              required
              disabled={submitting}
            >
              <option value="">Select a format</option>
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              required
              disabled={submitting}
            >
              <option value="">Select a category</option>
              <option value="Programming">Programming</option>
              <option value="Data Science">Data Science</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Finance">Finance</option>
              <option value="Writing">Writing</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              disabled={submitting}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Google Drive Link (Optional)
            </label>
            <input
              type="url"
              value={formData.driveLink}
              onChange={(e) =>
                setFormData({ ...formData, driveLink: e.target.value })
              }
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none"
              disabled={submitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              Share your course materials via Google Drive. Students get access after purchase.
            </p>
          </div>
        </motion.div>

        <motion.div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition"
          >
            {submitting ? "Adding..." : "Add Course"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default TutorAddCourse;
