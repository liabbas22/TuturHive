import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StudentCourses: React.FC = () => {
  const { user } = useAuth();
  const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);

  useEffect(() => {
    setPurchasedCourses((user?.purchasedCourses as any[]) || []);
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedCourses.map((course) => (
          <div key={(course as any)._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {course.imageUrl && (
              <img
                src={`http://localhost:5000${course.imageUrl}`}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              {course.tutor && (
                <p className="text-gray-600 mb-2">by {typeof course.tutor === 'string' ? '' : (course.tutor as any).name}</p>
              )}
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-emerald-600">Purchased</span>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Access Course</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {purchasedCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't purchased any courses yet.</p>
          <button
            onClick={() => window.location.href = '/courses'}
            className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;