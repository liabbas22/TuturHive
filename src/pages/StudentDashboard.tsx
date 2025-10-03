import React, { useMemo, useState } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import StudentProfile from '../components/StudentProfile';
import StudentCourses from '../components/StudentCourses';
import StudentMessages from '../components/StudentMessages';
import { useCourses } from '../contexts/courseContext';
import CourseComponent from '../components/CourseComponent';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { courses, isLoading, error } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'formal' | 'informal'>('all');

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

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <StudentProfile />;
      case 'courses':
        return <StudentCourses />;
      case 'messages':
        return <StudentMessages />;
      default:
        return <StudentProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 flex-shrink-0">
        <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;