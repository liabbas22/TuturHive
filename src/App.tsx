import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { CourseProvider } from "./contexts/courseContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import CoursesPage from "./pages/CoursesPage";
import TutorDashboard from "./pages/TutorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CoursePage from "./pages/CoursePage";
import PurchasePage from "./pages/purchasePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

/* ---------------- Protected Route ---------------- */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

/* ---------------- Layout ---------------- */
function AppLayout() {
  const location = useLocation();
  const hideFooterRoutes = ["/tutor-dashboard", "/student-dashboard"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      {/* Toasts (GLOBAL) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        newestOnTop
        theme="light"
      />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main>
          <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/course/:id" element={<CoursePage />} />

              <Route
                path="/tutor-dashboard"
                element={
                  <ProtectedRoute>
                    <TutorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/purchase/:id"
                element={
                  <ProtectedRoute>
                    <PurchasePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment-success"
                element={<PaymentSuccessPage />}
              />
            </Routes>
          </Suspense>
        </main>

        {!shouldHideFooter && <Footer />}
      </div>
    </>
  );
}

/* ---------------- App Root ---------------- */
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CourseProvider>
          <Router>
            <AppLayout />
          </Router>
        </CourseProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
