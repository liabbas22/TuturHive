import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { useCourses } from '../contexts/courseContext';
import CourseComponent from '../components/CourseComponent';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, isLoading, error } = useCourses();
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-500 to-emerald-600 text-white py-20 h-screen flex justify-center items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Welcome to TutorHive
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-yellow-100">
              Where Expert Tutors and Eager Students Connect for Exceptional Learning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/courses')}
                className="bg-white text-[#fac43c] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Browse Courses
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg border-2 border-white"
              >
                Join as Tutor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TutorHive?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the future of online education with our innovative platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-[#fac43c]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Courses</h3>
              <p className="text-gray-600">Curated content from industry experts and experienced educators</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Tutors</h3>
              <p className="text-gray-600">Learn from qualified professionals with real-world experience</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-[#fac43c]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificates</h3>
              <p className="text-gray-600">Earn recognized certificates upon course completion</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Growth</h3>
              <p className="text-gray-600">Advance your career with in-demand skills and knowledge</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About TutorHive
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                TutorHive is revolutionizing online education by creating a vibrant ecosystem where passionate 
                students connect with expert tutors. Our platform provides a seamless learning experience with 
                high-quality courses, interactive content, and personalized support that adapts to every learner's needs.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#fac43c] mb-2">500+</div>
                  <div className="text-gray-600">Expert Tutors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#fac43c] mb-2">10K+</div>
                  <div className="text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#fac43c] mb-2">1000+</div>
                  <div className="text-gray-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#fac43c] mb-2">95%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Students learning online"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600">
              Discover our most popular courses in the TutorHive community
            </p>
          </div>
          
          {isLoading && <div className="text-center text-gray-600">Loading courses...</div>}
          {error && !isLoading && <div className="text-center text-red-600">{error}</div>}
          {!isLoading && !error && featuredCourses.length === 0 && (
            <div className="text-center text-gray-600">No courses found.</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={(course as any)._id} >
                <CourseComponent course={course as any} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;