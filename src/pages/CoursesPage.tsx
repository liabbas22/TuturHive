import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useCourses } from '../contexts/courseContext';
import CourseComponent from '../components/CourseComponent';
const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'formal' | 'informal'>('all');
  const { courses, isLoading, error } = useCourses();

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach(c => { if (c.category) set.add(c.category); });
    return ['all', ...Array.from(set).sort()];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return courses.filter(course => {
      const matchesText = course.title.toLowerCase().includes(term) || course.description.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesFormat = selectedFormat === 'all' || course.format === selectedFormat;
      return matchesText && matchesCategory && matchesFormat;
    });
  }, [courses, searchTerm, selectedCategory, selectedFormat]);

  const handlePurchase = (course: { title: string; price: number }) => {
    alert(`Purchasing ${course.title} for $${course.price}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Courses
          </h1>
          <p className="text-lg text-gray-600">
            Discover amazing courses from expert tutors
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
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

        {isLoading && (
          <div className="text-center text-gray-600">Loading courses...</div>
        )}
        {error && !isLoading && (
          <div className="text-center text-red-600">{error}</div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseComponent key={course._id} course={course} />
          ))}
        </div>

        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;