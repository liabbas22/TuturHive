import { Play, Star, Clock, BookOpen, Volume2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCourses } from "../contexts/courseContext";
import { Course } from "../apis/course";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { getCourseById } = useCourses();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const courseData = await getCourseById(id);
        setCourse(courseData);
      } catch (err: any) {
        setError(err.message || "Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, getCourseById]);

  if (isLoading) {
    return (
      <main className="w-fit p-8 px-15 min-h-screen overflow-auto relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading course...</div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="w-fit p-8 px-15 min-h-screen overflow-auto relative">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">{error || "Course not found"}</div>
        </div>
      </main>
    );
  }
  return (
      <main className="w-fit p-8 px-15 min-h-screen overflow-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
              {course.category || "Course"} / {course.format === "formal" ? "Formal" : "Informal"}
            </div>

            {/* Course Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>

            {/* Instructor and Rating */}
            <div className="flex items-center mb-6">
              <span className="text-red-500 font-medium mr-4">
                {typeof course.tutor === 'object' ? course.tutor.name : 'Tutor'}
              </span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="font-semibold mr-2">4.8</span>
                <span className="text-gray-500 text-sm">(1,812 ratings)</span>
              </div>
            </div>

            {/* Video Preview */}
            <div className="relative bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl overflow-hidden mb-8 shadow-lg">
              <div className="aspect-video flex items-center justify-center relative">
                {course.videoUrl ? (
                  <video
                    className="absolute right-0 top-0 h-full w-auto object-cover opacity-80"
                    src={(course.videoUrl.startsWith('http') ? '' : 'http://localhost:5000') + course.videoUrl}
                    controls
                  />
                ) : (
                  (course.imageUrls?.[0] || course.imageUrl) ? (
                    <img
                      src={((course.imageUrls?.[0] || course.imageUrl)!.startsWith('http') ? '' : 'http://localhost:5000') + (course.imageUrls?.[0] || course.imageUrl)}
                      alt="Course preview"
                      className="absolute right-0 top-0 h-full w-auto object-cover opacity-80"
                    />
                  ) : (
                    <img
                      src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Course instructor"
                      className="absolute right-0 top-0 h-full w-auto object-cover opacity-80"
                    />
                  )
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-transparent"></div>
                <div className="relative z-10 text-left pl-8">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {course.title.toUpperCase()}
                  </h2>
                  <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105">
                    <Play className="w-8 h-8 fill-current" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-8">
                  <div className="bg-black bg-opacity-50 px-3 py-1 rounded text-white font-bold">
                    {course.category || "Course"}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button className="py-2 px-1 border-b-2 border-yellow-400 font-medium text-gray-900">
                  Description
                </button>
                <button className="py-2 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">
                  Courses
                </button>
                <button className="py-2 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">
                  Review
                </button>
              </nav>
            </div>

            {/* Media Gallery */}
            {(course.imageUrls && course.imageUrls.length > 1) && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {course.imageUrls.slice(1).map((img, idx) => (
                    <img key={idx} src={(img.startsWith('http') ? '' : 'http://localhost:5000') + img} alt={`Image ${idx+1}`} className="w-full h-32 object-cover rounded" />
                  ))}
                </div>
              </div>
            )}

            {/* About Course */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                About Course
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Review</h3>
              <div className="space-y-6">
                {/* Review 1 */}
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-800">
                      L
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-yellow-600 mr-2">
                        Leonardo Da Vinci
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Loved the course. I've learned some very subtle
                      techniques, especially on leaves.
                    </p>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-white">T</span>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-yellow-600 mr-2">
                        Titanic S
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      I loved the course, it had been a long time since I had
                      experimented with watercolors and now I will do it more
                      often thanks to Kiani Studio
                    </p>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-white">S</span>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-yellow-600 mr-2">
                        Shirkoy
                      </span>
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Yes, I just emphasize that the use of Photoshop, for
                      non-users, becomes difficult to follow. What requires a
                      course to master it. Safe and very didactic teacher.
                    </p>
                  </div>
                </div>

                {/* Review 4 */}
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-white">M</span>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-yellow-600 mr-2">
                        Miphoska
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      I haven't finished the course yet, as I would like to have
                      some feedback from the teacher, about the comments I
                      shared on the forum 3 months ago, and I still haven't had
                      any answer. I think the course is well structured, however
                      the explanations and videos are very quick for beginners.
                      However, it is good to go practicing.
                    </p>
                  </div>
                </div>

                {/* Load More Reviews */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center">
                    <span className="text-yellow-600 text-sm mr-2">
                      5 reviews
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <button className="text-gray-600 text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Load more review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Course Info */}
          <div className="lg:col-span-1 mt-33">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-gray-900 mr-3">
                    ${course.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${(course.price * 1.3).toFixed(2)}
                  </span>
                </div>
                <div className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  20% OFF
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                  Buy
                </button>
                <button className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                  CHAT REQUEST
                </button>
              </div>

              {/* Course Details */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-5 h-5 mr-3" />
                  <span>22 Section</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Play className="w-5 h-5 mr-3" />
                  <span>152 Lectures</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>21h 33m total lengths</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Volume2 className="w-5 h-5 mr-3" />
                  <span>English</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
