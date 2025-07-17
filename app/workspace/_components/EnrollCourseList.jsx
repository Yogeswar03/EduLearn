"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EnrolledCourseCard from './EnrolledCourseCard';
import { motion } from 'framer-motion'; 

function EnrollCourseList() {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnrolledCourse();
  }, []);

  const getEnrolledCourse = async () => {
    try {
      const result = await axios.get('/api/enroll-course');
      setEnrolledCourseList(result.data);
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-10 text-center text-gray-500">
        Loading enrolled courses...
      </div>
    );
  }

  if (!enrolledCourseList?.length) return null;

  return (
    <motion.div
      className="mt-10 px-4 sm:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-bold text-2xl mb-6">Continue Learning Your Courses</h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {enrolledCourseList.map((course, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <EnrolledCourseCard
              courses={course?.courses}
              enrollCourse={course?.enrollCourses}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default EnrollCourseList;
