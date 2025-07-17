"use client";

import React from 'react';
import { motion } from 'motion/react';
import WelcomeBanner from '../_components/WelcomeBanner';
import EnrollCourseList from '../_components/EnrollCourseList';

function MyLearning() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <WelcomeBanner />

      <motion.h2
        className="font-bold text-2xl mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        My Learning
      </motion.h2>

      <EnrollCourseList />
    </motion.div>
  );
}

export default MyLearning;
