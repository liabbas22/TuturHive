import { Play, BookOpen, Volume2, CheckCircle } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useCourses } from "../contexts/courseContext";
import { Course } from "../apis/course";
import { useAuth } from "../contexts/AuthContext";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { getCourseById } = useCourses();
  const { user, refreshUser } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [previewType, setPreviewType] = useState<"video" | "image">("video");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const courseData = await getCourseById(id);
        setCourse(courseData);
      } catch (err: any) {
        setError(err?.message || "Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id, getCourseById]);

  useEffect(() => {
    if (user && user.role === "student") {
      refreshUser();
    }
  }, []);

  useEffect(() => {
    if (user && user.purchasedCourses && id) {
      const purchased = user.purchasedCourses.some(
        (p: any) => p._id === id || p.id === id
      );
      setIsPurchased(purchased);
    } else {
      setIsPurchased(false);
    }
  }, [user, id]);

  const getVideoUrl = (url: string) =>
    url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  const getImageUrl = (url: string) =>
    url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  const handlePlayClick = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
    setIsVideoPlaying(true);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-lg text-gray-700">Loading course...</div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-lg text-red-600">{error || "Course not found"}</div>
      </main>
    );
  }

  let galleryImages: string[] = [];
  let showVideoInGallery = false;

  if (course.imageUrls && course.imageUrls.length > 1) {
    if (previewType === "video") {
      galleryImages = course.imageUrls.slice(1);
    } else if (previewType === "image" && previewImage) {
      galleryImages = course.imageUrls.filter((img) => img !== previewImage);
      showVideoInGallery = true;
    }
  }

  const handleImageClick = (img: string) => {
    setPreviewType("image");
    setPreviewImage(img);
    setIsVideoPlaying(false);
    videoRef.current?.pause();
  };

  const handleVideoClick = () => {
    setPreviewType("video");
    setPreviewImage(null);
  };

  return (
    <main className="min-h-screen p-6 lg:p-12 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="text-sm text-gray-500 font-playDEGrund">
            {course.category || "Course"} /{" "}
            {course.format === "formal" ? "Formal" : "Informal"}
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 font-merienda">
            {course.title}
          </h1>

          <div className="relative rounded-xl overflow-hidden shadow-lg h-80 md:h-[28rem] bg-black">
            {previewType === "video" && course.videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={getVideoUrl(course.videoUrl)}
                controls
                preload="auto"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onEnded={() => setIsVideoPlaying(false)}
              />
            ) : (
              previewImage && (
                <img
                  src={getImageUrl(previewImage)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )
            )}

            {previewType === "video" && !isVideoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-black/80 to-black/30">
                <button
                  onClick={handlePlayClick}
                  className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
                >
                  <Play className="w-7 h-7 text-white ml-1" />
                </button>
              </div>
            )}
          </div>

          {(galleryImages.length > 0 || showVideoInGallery) && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {showVideoInGallery && course.videoUrl && (
                  <div
                    className="relative cursor-pointer rounded-lg overflow-hidden"
                    onClick={handleVideoClick}
                  >
                    <video
                      className="w-full h-32 md:h-40 object-cover opacity-80"
                      src={getVideoUrl(course.videoUrl)}
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white bg-black/60 rounded-full p-1" />
                    </div>
                  </div>
                )}

                {galleryImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={getImageUrl(img)}
                    alt=""
                    className="w-full h-32 md:h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                    onClick={() => handleImageClick(img)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-3 font-merienda">
              About Course
            </h3>
            <p className="text-gray-700 text-sm font-playDEGrund tracking-wide">
              {course.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1 mt-6 lg:mt-0">
          <div className="bg-white shadow-lg rounded-xl p-6 sticky top-8">
            <span className="text-2xl font-bold text-gray-900 font-merienda">
              ${course.price?.toFixed(2)}
            </span>

            {isPurchased ? (
              <div className="mt-4 bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Purchased
              </div>
            ) : (
              user?.role !== "tutor" && (
                <Link
                  to={`/purchase/${id}`}
                  state={{
                    course: {
                      _id: course._id,
                      title: course.title,
                      tutor:
                        typeof course.tutor === "object"
                          ? course.tutor.name
                          : course.tutor,
                      price: course.price,
                      image:
                        course.imageUrl || course.imageUrls?.[0] || "",
                      description: course.description,
                    },
                  }}
                  className="mt-4 block w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg text-center"
                >
                  Buy Now
                </Link>
              )
            )}

            <div className="mt-6 space-y-3 text-gray-600 font-merienda">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                {course.sections || 0} Sections
              </div>
              <div className="flex items-center">
                <Play className="w-5 h-5 mr-2" />
                {course.lectures || 0} Lectures
              </div>
              <div className="flex items-center">
                <Volume2 className="w-5 h-5 mr-2" />
                {course.language || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
