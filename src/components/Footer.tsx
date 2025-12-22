import { FC } from "react";
import { motion, Variants } from "framer-motion";

const Footer: FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { staggerChildren: 0.1, ease: "easeOut" } 
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.footer
      className="w-full bg-[#F6D684] text-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 md:py-14">
        <motion.div variants={itemVariants} className="mb-10 flex justify-center md:justify-start">
          <div className="w-36 cursor-pointer">
            <img src="/images/logo.svg" alt="Company Logo" className="w-full object-contain" />
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-10 md:grid-cols-4" variants={containerVariants}>
          <motion.div variants={itemVariants} className="md:col-span-2">
            <h3 className="mb-4 text-2xl font-bold font-merienda tracking-wide">Real Estate</h3>
            <p className="max-w-lg text-base leading-relaxed text-gray-700 tracking-wide font-playDEGrund">
              As a new client of G.R. Traders, we were delighted with their dedication to quality and prompt delivery. Even during market shortages, they ensured timely procurement of required goods.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              {[
                { src: "/images/Facebook_Logo.svg", alt: "Facebook", link: "https://facebook.com" },
                { src: "/images/Youtube_Logo.svg", alt: "YouTube", link: "https://youtube.com" },
                { src: "/images/Linkdin_Logo.svg", alt: "LinkedIn", link: "https://linkedin.com" },
                { src: "/images/Instagram_Logo.svg", alt: "Instagram", link: "https://instagram.com" },
              ].map((icon, index) => (
                <motion.a
                  key={index}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={icon.alt}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-300 shadow-sm transition-all duration-300 hover:bg-yellow-400 hover:scale-105"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                >
                  <img src={icon.src} alt={icon.alt} className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-xl font-semibold font-merienda tracking-wide text-gray-800">Company</h4>
            <ul className="space-y-3 font-sans tracking-widest">
              {["Our Agents", "FAQs", "Testimonials", "About Us", "Contact Us"].map((item, index) => (
                <motion.li
                  key={index}
                  className="cursor-pointer text-gray-700 hover:text-yellow-500 transition-colors duration-300"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-xl font-semibold font-merienda tracking-wide">Contact</h4>
            <ul className="space-y-3 text-gray-700 font-sans tracking-wider">
              <li>📞 +923040635922</li>
              <li>✉️ Jhon@gmail.com</li>
              <li>📍Near Court of Thatta, Royal City Makli</li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 border-t border-black/10 pt-6 text-center text-sm text-gray-700 font-playDEGrund tracking-wider">
          © {new Date().getFullYear()} TutorHive. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
