import React from 'react';
import type { Course } from '../apis/course';
import { Link } from 'react-router-dom';

type Props = {
  course: Course;
  onClick?: (course: Course) => void;
};

const CourseComponent: React.FC<Props> = ({ course, onClick }) => {
  const primaryImage = course.imageUrls?.[0] || course.imageUrl;
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/course/${course._id}`}>
        {primaryImage ? (
          <img src={(primaryImage.startsWith('http') ? '' : 'http://localhost:5000') + primaryImage} alt={course.title} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
        )}
      </Link>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
          <div className="flex gap-2">
            {course.category && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">{course.category}</span>
            )}
            {course.format && (
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${course.format === 'formal' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{course.format}</span>
            )}
          </div>
        </div>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-600">${course.price}</span>
          <button
            onClick={() => onClick?.(course)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseComponent;

