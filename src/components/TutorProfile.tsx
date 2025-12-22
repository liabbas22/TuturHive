import React, { useEffect, useState } from "react";
import { User, Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const TutorProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: (user as any)?.bio || "",
    expertise: (user as any)?.expertise || "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        bio: (user as any)?.bio || "",
        expertise: (user as any)?.expertise || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    await updateProfile({
      name: profile.name,
      bio: profile.bio,
      expertise: profile.expertise,
    } as any);
    setIsEditing(false);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex items-center justify-between mb-8"
        variants={itemVariants}
      >
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 font-merienda">
          Tutor Profile
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition"
        >
          {isEditing ? "Cancel" : <p className="flex items-center gap-1 font-medium font-sans">Edit <span className="hidden md:block">Profile</span></p>}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <motion.div
            className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <User className="h-16 w-16 text-yellow-600" />
          </motion.div>

          <div className="flex justify-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-5 h-5 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>

          <p className="text-sm text-gray-500">4.9 / 5 Rating</p>
        </motion.div>

        <motion.div
          className="lg:col-span-2 space-y-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            ) : (
              <p className="text-base font-medium text-gray-900">
                {profile.name}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <p className="text-base font-medium text-gray-900">
              {profile.email}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Bio
            </label>
            {isEditing ? (
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || "—"}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Areas of Expertise
            </label>
            {isEditing ? (
              <input
                value={profile.expertise}
                onChange={(e) =>
                  setProfile({ ...profile, expertise: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            ) : (
              <p className="text-base font-medium text-gray-900">
                {profile.expertise || "—"}
              </p>
            )}
          </motion.div>

          {isEditing && (
            <motion.div
              className="flex flex-col sm:flex-row gap-3 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
              >
                Save Changes
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-600 transition"
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

export default TutorProfile;
