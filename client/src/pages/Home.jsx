import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "motion/react";
import img from "../assets/img1.png";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen overflow-hidden bg-white text-black">
      <Navbar />

      {/* top */}
      <section className="max-w-7xl mx-auto px-8 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ rotateX: 6, rotateY: -6 }}
            className="transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h1
              className="text-5xl lg:text-6xl font-extrabold leading-tight
                    bg-gradient-to-br from-black/90 via-black/60 to-black/90
                    bg-clip-text text-transparent"
              whileHover={{ y: -4 }}
              style={{
                transform: "translateZ(40px)",
                textShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
            >
              Create Smart <br /> AI Notes in Seconds
            </motion.h1>

            <motion.p
              whileHover={{ y: -2 }}
              className=" mt-6 max-w-xl text-lg
                    bg-gradient-to-br from-gray-700 via-gray-500/80 to-gray-700
                    bg-clip-text text-transparent"
              style={{
                transform: "translateZ(40px)",
                textShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
            >
              Generate exam-focused notes, project documentation, flow diagrams
              and revision-ready content using AI — faster, cleaner and smarter.
            </motion.p>
          </motion.div>

          <motion.button
            onClick={() => navigate("/notes")}
            whileHover={{
              scale: 1.07,
            }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 px-10 py-3 rounded-xl
                                flex items-center gap-3
                                bg-gradient-to-br from-black/90 via-black/80 to-black/90
                                border border-white/10
                                text-white font-semibold text-lg
                                shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
          >
            Get Started
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          whileHover={{
            y: -12,
            rotateX: 8,
            rotateY: -8,
            scale: 1.05,
          }}
          className="transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="overflow-hidden">
            <img
              src={img}
              alt="img"
              style={{ transform: "translateZ(35px)" }}
            />
          </div>
        </motion.div>
      </section>

      {/* bottom */}
      <section className="max-w-6xl mx-auto px-8 py-32 grid grid-cols-1 md:grid-cols-4 gap-10">
        <Feature
          icon="📘"
          title="Exam Notes"
          des="High-yield exam-oriented notes with revision points."
        />
        <Feature
          icon="📂"
          title="Project Notes"
          des="Well-structured content for assignments and projects."
        />
        <Feature
          icon="📊"
          title="Diagrams"
          des="Auto-generated visual diagrams for clarity."
        />
        <Feature
          icon="⬇️"
          title="PDF Download"
          des="Download clean, printable PDFs instantly."
        />
      </section>
      <Footer />
    </div>
  );
};

function Feature({ icon, title, des }) {
  return (
    <motion.div
      whileHover={{ y: -12, rotateX: 8, rotateY: -8, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="relative rounded-2xl p-6
        bg-gradient-to-br from-black/90 via-black/80 to-black/90
        backdrop-blur-2xl
        border border-white/10
        shadow-[0_30px_80px_rgba(0,0,0,0.7)]
        text-white"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{des}</p>
      </div>
    </motion.div>
  );
}

export default Home;
