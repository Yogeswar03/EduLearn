"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Search } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AddNewCourseDialog from '../_components/AddNewCourseDialog';
import CourseCard from '../_components/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'motion/react';

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getCourseList();
    }
  }, [user]);

  const getCourseList = async () => {
    try {
      const result = await axios.get('/api/courses?courseId=0');
      let rawData = result.data;

      if (!Array.isArray(rawData)) rawData = [rawData];

      const filteredCourses = rawData.filter(
        (course) =>
          Array.isArray(course.courseContent) &&
          course.courseContent.length > 0 &&
          course.name &&
          course.cid
      );

      setCourseList(filteredCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <motion.h2
        className="font-bold text-3xl mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Explore More Courses
      </motion.h2>

      <motion.div
        className="flex gap-3 max-w-md mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Input placeholder="Search for courses..." />
        <Button><Search size={18} />Search</Button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((_, i) => (
            <Skeleton key={i} className="w-full h-[260px] rounded-xl" />
          ))}
        </div>
      ) : courseList.length === 0 ? (
        <motion.div
          className="p-7 flex items-center justify-center flex-col border rounded-xl my-5 bg-gray-100 shadow-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Image src={'/image.png'} alt='bannerImage' width={150} height={120} />
          <h2 className="my-3 text-xl font-bold text-center">
            No courses available to explore right now.
          </h2>
          <AddNewCourseDialog>
            <Button className="p-4 text-md mt-2 cursor-pointer">+ Create Your First Course</Button>
          </AddNewCourseDialog>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 my-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {courseList.map((course, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default Explore;
