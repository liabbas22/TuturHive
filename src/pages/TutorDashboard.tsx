import React, { useMemo, useState } from 'react';
import TutorSidebar from '../components/TutorSidebar';
import TutorProfile from '../components/TutorProfile';
import TutorCourses from '../components/TutorCourses';
import TutorAddCourse from '../components/TutorAddCourse';
import TutorMessages from '../components/TutorMessages';
import { useCourses } from '../contexts/courseContext';
import CourseComponent from '../components/CourseComponent';
import { useAuth } from '../contexts/AuthContext';

const TutorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { courses, isLoading, error } = useCourses();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'formal' | 'informal'>('all');

  // Derive tutor's courses from global list and current user
  const ownCourses = useMemo(() => {
    if (!user) return [] as any[];
    return courses.filter(c => {
      const tutorId = typeof c.tutor === 'string' ? c.tutor : (c.tutor as any)?._id;
      return tutorId === user.id;
    });
  }, [courses, user]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    ownCourses.forEach(c => { if (c.category) set.add(c.category); });
    return ['all', ...Array.from(set).sort()];
  }, [ownCourses]);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return ownCourses.filter(course => {
      const matchesText = course.title.toLowerCase().includes(term) || course.description.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesFormat = selectedFormat === 'all' || course.format === selectedFormat;
      return matchesText && matchesCategory && matchesFormat;
    });
  }, [ownCourses, searchTerm, selectedCategory, selectedFormat]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <TutorProfile />;
      case 'courses':
        return (
          <div>
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div className="w-full md:w-56">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-56">
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="all">All Formats</option>
                    <option value="formal">Formal</option>
                    <option value="informal">Informal</option>
                  </select>
                </div>
              </div>
            </div>
            {isLoading && <div className="text-gray-600">Loading courses...</div>}
            {error && !isLoading && <div className="text-red-600">{error}</div>}
            {!isLoading && !error && filteredCourses.length === 0 && (
              <div className="text-gray-600">No courses found.</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseComponent key={(course as any)._id} course={course as any} />
              ))}
            </div>
          </div>
        );
      case 'add-course':
        return <TutorAddCourse onCancel={() => setActiveTab('courses')} />;
      case 'messages':
        return <TutorMessages />;
      default:
        return <TutorProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 flex-shrink-0">
        <TutorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default TutorDashboard;