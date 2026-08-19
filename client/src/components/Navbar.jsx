import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const credits = userData.credits;
  const [showCredits, setShowCredits] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/auth");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className="relative z-20 mx-6 mt-6
        rounded-2xl
        bg-gradient-to-br from-black/90 via-black/80 to-black/90
        backdrop-blur-2xl
        border border-white/10
        shadow-[0_22px_55px_rgba(0,0,0,0.75)]
        flex items-center justify-between px-8 py-4"
    >
      <div className="flex items-center gap-3">
        <img src={logo} alt="examnotes" className="w-9 h-9" />
        <span className="text-lg hidden md:block font-semibold text-white">
          ExamNotes <span className="text-gray-400">AI</span>
        </span>
      </div>

      <div className="flex items-center gap-6 relative">
        <div className="relative">
          <motion.div
            onClick={() => {
              setShowCredits(!showCredits);
              setShowProfile(false);
            }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-1
                px-4 py-2 rounded-full
                bg-white/10
                border border-white/20
                text-white text-sm
                shadow-md
                cursor-pointer"
          >
            <span className="text-xl">💠</span>
            <span>{credits}</span>
            <motion.span
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.97 }}
              className="ml-2 h-5 w-5 flex items-center justify-center
                  rounded-full bg-white  text-xs font-bold"
            >
              ➕
            </motion.span>
          </motion.div>
          <AnimatePresence>
            {showCredits && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 10, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-[-50px] mt-4 w-64
                    rounded-2xl
                    bg-black/90 backdrop-blur-xl
                    border border-white/10
                    shadow-[0_25px_60px_rgba(0,0,0,0.7)]
                    p-4 text-white"
              >
                <h4 className="font-semibold mb-2">Buy Credits</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Use credits to generate AI notes, diagrams & PDFs.
                </p>
                <button
                  onClick={() => {
                    setShowCredits(false);
                    navigate("/pricing");
                  }}
                  className=" w-full py-2 rounded-lg
                      bg-gradient-to-br from-white to-gray-200
                      text-black font-semibold
                      hover:opacity-90"
                >
                  Buy More Credits
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <motion.div
            onClick={() => {
              setShowProfile(!showProfile);
              setShowCredits(false);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-1
                px-4 py-2 rounded-full
                bg-white/10
                border border-white/20
                text-white text-sm
                shadow-md
                cursor-pointer"
          >
            <span className="text-lg">
              {userData?.name.slice(0, 1).toUpperCase()}
            </span>
          </motion.div>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 10, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-4 w-52
                    rounded-2xl
                    bg-black/90 backdrop-blur-xl
                    border border-white/10
                    shadow-[0_25px_60px_rgba(0,0,0,0.7)]
                    p-4 text-white"
              >
                <MenuItem
                  text="History"
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/history");
                  }}
                />
                <div className="h-px bg-white/10 mx-3" />
                <MenuItem text="sign out" red onClick={handleSignOut} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function MenuItem({ onClick, text, red }) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full text-left px-5 py-3 text-sm
        transition-colors rounded-lg
        ${
          red
            ? "text-red-400 hover:bg-red-500/10"
            : "text-gray-200 hover:bg-white/10"
        }
      `}
    >
      {text}
    </div>
  );
}

export default Navbar;
