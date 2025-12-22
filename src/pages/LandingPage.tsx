import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useCourses } from "../contexts/courseContext";
import CourseComponent from "../components/CourseComponent";
import { useAuth } from "../contexts/AuthContext";
import BannerImage from "../Assets/Banner1.jpg";

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 80, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, isLoading, error } = useCourses();
  const { user } = useAuth();

  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <section className="relative min-h-screen flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BannerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-[#fac43c] to-emerald-500 opacity-70" />
        <div className="absolute inset-0 bg-black/30" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.div variants={fadeUp} className="inline-flex mb-6 rounded-full bg-white/20 px-5 py-2 text-xs sm:text-sm font-semibold backdrop-blur">
            🚀 Trusted by 10,000+ learners worldwide
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-merienda font-extrabold leading-tight mb-6">
            Learn Smarter with <span className="text-yellow-100">TutorHive</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl text-yellow-100 mb-10 font-playDEGrund">
            Connect with expert tutors, master in-demand skills, and accelerate your learning journey.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={() => navigate("/courses")}
              className="rounded-xl bg-yellow-500 hover:bg-yellow-400 px-8 py-4 text-base sm:text-lg font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              Browse Courses
            </button>

            {!user && (
              <button
                onClick={() => navigate("/signup")}
                className="rounded-xl border-2 border-white px-8 py-4 text-base sm:text-lg font-semibold text-white hover:bg-white hover:text-[#fac43c] transition-all hover:scale-105"
              >
                Become a Tutor
              </button>
            )}
          </motion.div>
        </motion.div>
      </section>

      <section className="py-12 md:py-20 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-merienda font-bold tracking-wider text-gray-900 mb-4">
              Why Choose TutorHive?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 tracking-wide font-playDEGrund">
              Everything you need for world-class online learning
            </p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, title: "Quality Courses", desc: "Expert-curated content", color: "yellow" },
              { icon: Users, title: "Expert Tutors", desc: "Learn from professionals", color: "emerald" },
              { icon: Award, title: "Certificates", desc: "Credentials that matter", color: "yellow" },
              { icon: TrendingUp, title: "Career Growth", desc: "Skills for your future", color: "emerald" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="group rounded-2xl p-6 text-center hover:-translate-y-2 hover:shadow-xl transition">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${item.color === "yellow" ? "bg-yellow-100 text-yellow-500" : "bg-emerald-100 text-emerald-600"}`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-merienda text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 font-playDEGrund">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-yellow-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-merienda font-bold mb-6">About TutorHive</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 font-playDEGrund mb-6">
              TutorHive connects motivated learners with expert tutors through an intuitive learning platform.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                ["500+", "Expert Tutors"],
                ["10K+", "Students"],
                ["1000+", "Courses"],
                ["95%", "Success Rate"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="text-3xl font-bold text-[#fac43c] font-merienda">{value}</div>
                  <div className="text-gray-600">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div>
            <img src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg" alt="Online learning" className="rounded-2xl shadow-xl" />
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-merienda font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 font-playDEGrund">Learn from our most popular programs</p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course: any) => (
              <motion.div key={course._id} variants={fadeUp} className="hover:-translate-y-2 hover:shadow-xl rounded-xl transition">
                <CourseComponent course={course} />
              </motion.div>
            ))}
          </motion.div>

          {isLoading && <div className="text-center mt-6">Loading...</div>}
          {error && <div className="text-center text-red-600">{error}</div>}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
