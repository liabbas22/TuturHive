import React from "react";
import { User, BookOpen, MessageCircle, GraduationCap } from "lucide-react";

interface StudentSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "messages", label: "Messages", icon: MessageCircle },
  ];

  return (
    <aside className="bg-white shadow-lg h-full md:h-screen md:sticky md:top-0 w-full md:w-64">
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 ml-2 md:ml-0 mb-10">
          <GraduationCap className="h-8 w-8 text-yellow-600" />
          <span className="text-lg font-bold tracking-wide text-gray-900 hidden md:block font-playDEGrund ">
            TutorHive
          </span>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      group w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      text-left transition-all duration-200
                      ${
                        isActive
                          ? "bg-yellow-100 text-yellow-700 font-semibold border-l-4 border-yellow-600"
                          : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        isActive
                          ? "text-yellow-600"
                          : "text-gray-500 group-hover:text-yellow-600"
                      }`}
                    />

                    {/* Hide text on small screens */}
                    <span className="hidden md:block tracking-wide">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default StudentSidebar;
