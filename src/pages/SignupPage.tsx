import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, User, BookOpen } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signup(formData.name, formData.email, formData.password, role);

      if (role === "tutor") {
        toast.success("Tutor signup successfully!");
        navigate("/tutor-dashboard");
      } else {
        toast.success("Student signup successfully!");
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-12 w-12 text-yellow-600" />
            </div>
            <h2 className="text-center text-2xl font-merienda font-bold tracking-wider text-gray-900">
              Create Your TutorHive Account
            </h2>

            <p className="text-center text-sm text-gray-600 my-4 font-playDEGrund">
              Create your account and start your learning journey
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-playDEGrund">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    role === "student"
                      ? "border-yellow-600 bg-yellow-50 text-yellow-600 shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <User className="h-8 w-8 mx-auto mb-2" />
                  <span className="font-medium">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("tutor")}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    role === "tutor"
                      ? "border-yellow-600 bg-yellow-50 text-yellow-600 shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <BookOpen className="h-8 w-8 mx-auto mb-2" />
                  <span className="font-medium">Tutor</span>
                </button>
              </div>
            </div>

            <div className="">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 font-merienda"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                  placeholder="Full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 font-merienda"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="tracking-wide appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 font-merienda"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-yellow-600 hover:text-yellow-500"
                >
                  Sign in
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
