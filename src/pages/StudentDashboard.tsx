import React, { useState } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import StudentProfile from '../components/StudentProfile';
import StudentCourses from '../components/StudentCourses';
import StudentMessages from '../components/StudentMessages';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  // Per-tab content handles its own state (courses, search, filters)

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
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <div className="flex-shrink-0">
        <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 p-4 md:p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;