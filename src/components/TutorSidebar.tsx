import React from "react";
import {
  User,
  BookOpen,
  Plus,
  MessageCircle,
  GraduationCap,
} from "lucide-react";

interface TutorSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TutorSidebar: React.FC<TutorSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "add-course", label: "Add Course", icon: Plus },
    { id: "messages", label: "Messages", icon: MessageCircle },
  ];

  return (
    <aside className="bg-white shadow-lg h-full md:h-screen md:sticky md:top-0 w-full md:w-64 overflow-hidden">
      <div className="px-6 py-8 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-10">
          <GraduationCap className="h-8 w-8 text-yellow-600 ml-2 md:ml-0" />
          <span className="hidden md:block text-lg font-bold tracking-wide text-gray-900 font-playDEGrund">
            TutorHive
          </span>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-yellow-100 text-yellow-700 font-semibold"
                        : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        isActive
                          ? "text-yellow-600"
                          : "text-gray-500 group-hover:text-yellow-600"
                      }`}
                    />
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

export default TutorSidebar;
