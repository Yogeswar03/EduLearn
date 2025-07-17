"use client"

import React from 'react';
import { motion } from 'framer-motion'; // ✅ Corrected import

function WelcomeBanner() {
  return (
    <motion.div
      className="p-6 sm:p-8 bg-gradient-to-tl from-blue-500 via-red-500 to-purple-500 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-bold text-2xl sm:text-3xl text-white">
        Welcome to EduLearn
      </h2>
      <p className="text-white mt-1 text-sm sm:text-base">
        Create, Learn & Explore your Favorite Courses
      </p>
    </motion.div>
  );
}

export default WelcomeBanner;
