import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "./NotificationBell";
import { toast } from "react-toastify";

/* =======================
   Types
======================= */
type NavButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

type DropdownItemProps = {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
};

type MobileItemProps = {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
};

type MobilePrimaryProps = {
  children: React.ReactNode;
  onClick: () => void;
};

/* =======================
   Reusable Components
======================= */
const NavButton: React.FC<NavButtonProps> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="text-sm font-medium text-gray-700 transition hover:text-[#fac43c]"
  >
    {children}
  </button>
);

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  danger = false,
}) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2 text-left text-sm transition
      ${
        danger
          ? "text-gray-700 hover:bg-red-50 hover:text-red-500"
          : "text-gray-700 hover:bg-yellow-50 hover:text-[#fac43c]"
      }`}
  >
    {children}
  </button>
);

const MobileItem: React.FC<MobileItemProps> = ({
  children,
  onClick,
  danger = false,
}) => (
  <button
    onClick={onClick}
    className={`w-full rounded-lg px-3 py-2 text-left text-base font-medium transition
      ${
        danger
          ? "text-gray-700 hover:bg-red-50 hover:text-red-500"
          : "text-gray-700 hover:bg-yellow-50 hover:text-[#fac43c]"
      }`}
  >
    {children}
  </button>
);

const MobilePrimary: React.FC<MobilePrimaryProps> = ({
  children,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-full rounded-lg bg-[#fac43c] px-3 py-2 text-base font-semibold text-white transition hover:bg-yellow-600"
  >
    {children}
  </button>
);

/* =======================
   Navbar Component
======================= */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeMenus = () => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-yellow-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">

          {/* Logo */}
          <Link to="/" onClick={closeMenus} className="flex items-center">
            <img
              src="/images/logo.svg"
              alt="TutorHive"
              className="h-9 lg:h-11 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <NavButton onClick={() => navigate("/courses")}>
                  <span className="relative text-[15px] font-medium
                    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
                    after:w-0 after:bg-[#fac43c] after:transition-all
                    hover:after:w-full">
                    Courses
                  </span>
                </NavButton>

                <NavButton onClick={() => navigate("/login")}>
                  <span className="relative text-[15px] font-medium
                    after:absolute after:-bottom-1 after:left-0 after:h-[2px]
                    after:w-0 after:bg-[#fac43c] after:transition-all
                    hover:after:w-full">
                    Login
                  </span>
                </NavButton>

                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-xl bg-[#fac43c] px-6 py-2.5
                    text-sm font-semibold text-white shadow
                    transition hover:bg-yellow-600"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center gap-5">
                <NotificationBell />

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown((p) => !p)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2
                      text-sm font-medium text-gray-700
                      hover:bg-yellow-50 hover:text-[#fac43c] transition"
                  >
                    <User className="h-5 w-5" />
                    <span className="max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-52 rounded-2xl
                      bg-white shadow-xl border border-yellow-100 overflow-hidden">
                      <DropdownItem
                        onClick={() => {
                          navigate(
                            user?.role === "tutor"
                              ? "/tutor-dashboard"
                              : "/student-dashboard"
                          );
                          closeMenus();
                        }}
                      >
                        Dashboard
                      </DropdownItem>

                      <DropdownItem
                        danger
                        onClick={() => {
                          logout();
                          closeMenus();
                          toast.success("You Logout Successfully")
                        }}
                      >
                        Logout
                      </DropdownItem>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="md:hidden rounded-lg p-2 text-gray-700
              hover:bg-yellow-50 hover:text-[#fac43c] transition"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-yellow-100 bg-white shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {!isAuthenticated ? (
              <>
                <MobileItem
                  onClick={() => {
                    navigate("/courses");
                    closeMenus();
                  }}
                >
                  Courses
                </MobileItem>

                <MobileItem
                  onClick={() => {
                    navigate("/login");
                    closeMenus();
                  }}
                >
                  Login
                </MobileItem>

                <MobilePrimary
                  onClick={() => {
                    navigate("/signup");
                    closeMenus();
                  }}
                >
                  Sign Up
                </MobilePrimary>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 border-b border-yellow-100 pb-3">
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="font-medium text-gray-800">
                    {user?.name}
                  </span>
                </div>

                <MobileItem
                  onClick={() => {
                    navigate(
                      user?.role === "tutor"
                        ? "/tutor-dashboard"
                        : "/student-dashboard"
                    );
                    closeMenus();
                  }}
                >
                  Dashboard
                </MobileItem>

                <MobileItem
                  danger
                  onClick={() => {
                    logout();
                    closeMenus();
                  }}
                >
                  Logout
                </MobileItem>

                <div className="pt-2">
                  <NotificationBell />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
