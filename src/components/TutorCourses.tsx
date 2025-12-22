import React, { useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useCourses } from '../contexts/courseContext';
import { useAuth } from '../contexts/AuthContext';
import type { Course } from '../apis/course';

const TutorCourses: React.FC = () => {
  const { courses, deleteCourse } = useCourses();
  const { user } = useAuth();

  const myCourses = useMemo(() => {
    if (!user) return [] as Course[];
    return courses.filter((c: Course) => {
      const tutorId = typeof c.tutor === 'string' ? c.tutor : (c.tutor as any)?._id;
      return tutorId === user.id;
    });
  }, [courses, user]);
const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const handleEdit = (course: Course) => {
    // Handle edit functionality
    console.log('Edit course:', course);
  };

  const handleDelete = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
    } catch (err) {
      console.error('Failed to delete course', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => { }}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Course</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((course: Course) => (
          <div key={course._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {course.imageUrl && (
              <img
                src={`${backendUrl}${course.imageUrl}`}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-yellow-600">${course.price}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't created any courses yet.</p>
          <button
            onClick={() => { /* TODO: open add-course flow */ }}
            className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Create Your First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default TutorCourses;