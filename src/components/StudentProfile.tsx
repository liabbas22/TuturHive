import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion, Variants } from "framer-motion";

/* =======================
   Motion Variants
======================= */

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/* =======================
   Component
======================= */

const StudentProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    interests: (user as any)?.interests || "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        interests: (user as any)?.interests || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    await updateProfile({
      name: profile.name,
      interests: profile.interests,
    } as any);
    setIsEditing(false);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ================= Header ================= */}
      <motion.div
        className="flex items-center justify-between mb-8"
        variants={itemVariants}
      >
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 font-merienda">
          Student Profile
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          className="bg-yellow-600 text-white px-4 py-2 text-sm rounded-lg
                     hover:bg-yellow-700 transition font-medium"
        >
          {isEditing ? "Cancel" : <p className="flex items-center gap-1 font-medium font-sans">Edit <span className="hidden md:block">Profile</span></p>}
        </motion.button>
      </motion.div>

      {/* ================= Content ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------- Avatar ---------- */}
        <motion.div
          className="lg:col-span-1 text-center"
          variants={itemVariants}
        >
          <motion.div
            className="w-32 h-32 bg-yellow-100 rounded-full flex items-center
                       justify-center mx-auto mb-4"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <User className="h-16 w-16 text-yellow-600" />
          </motion.div>

          <p className="text-gray-600 text-sm tracking-wide">
            Student Member
          </p>
        </motion.div>

        {/* ---------- Fields ---------- */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          variants={containerVariants}
        >
          {/* Full Name */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>

            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                           text-sm shadow-sm focus:border-yellow-500
                           focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            ) : (
              <p className="text-base font-medium text-gray-900">
                {profile.name}
              </p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <p className="text-base font-medium text-gray-900">
              {profile.email}
            </p>
          </motion.div>

          {/* Interests */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Learning Interests
            </label>

            {isEditing ? (
              <input
                type="text"
                value={profile.interests}
                onChange={(e) =>
                  setProfile({ ...profile, interests: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5
                           text-sm shadow-sm focus:border-yellow-500
                           focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
            ) : (
              <p className="text-base font-medium text-gray-900">
                {profile.interests || "—"}
              </p>
            )}
          </motion.div>

          {/* ---------- Action Buttons ---------- */}
          {isEditing && (
            <motion.div
              className="flex flex-col sm:flex-row gap-3 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg
                           text-sm font-semibold hover:bg-emerald-700 transition"
              >
                Save Changes
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-6 py-2.5 rounded-lg
                           text-sm font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;
