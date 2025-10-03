import React from 'react';
import { User, BookOpen, MessageCircle, GraduationCap } from 'lucide-react';

interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  return (
    <div className="bg-white shadow-lg h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <GraduationCap className="h-8 w-8 text-yellow-600" />
          <span className="text-xl font-bold text-gray-900">TutorHive</span>
        </div>
        
        <nav className="space-y-2">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id 
                      ? 'bg-yellow-50 text-yellow-600 border-r-2 border-yellow-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default StudentSidebar;