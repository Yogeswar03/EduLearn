import Image from 'next/image';
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

function EnrolledCourseCard({ courses, enrollCourse }) {
  const courseJson = courses?.courseJson?.course;

  const calculatePerProgress = () => {
    const completed = enrollCourse?.completedChapters?.length ?? 0;
    const total = courses?.courseContent?.length ?? 1;
    return Math.round((completed / total) * 100);
  };

  if (!courseJson) {
    return (
      <div className="text-red-500 font-medium p-4 border rounded-md">
        Invalid course data
      </div>
    );
  }

  return (
    <motion.div
      className="shadow-lg rounded-xl p-4 max-w-[450px] w-full bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {courses?.bannerImageUrl ? (
        <Image
          src={courses.bannerImageUrl}
          alt={courseJson?.name || "Course"}
          width={400}
          height={300}
          className="w-full aspect-video rounded-xl object-cover"
        />
      ) : (
        <div className="w-full h-[200px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
          No Image Available
        </div>
      )}

      <div className="flex flex-col gap-3 mt-4">
        <h2 className="font-bold text-xl line-clamp-1">
          {courseJson?.name || "Untitled Course"}
        </h2>

        <p className="line-clamp-3 text-gray-500 text-sm">
          {courseJson?.description || "No description available."}
        </p>

        <div className="mt-2">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{calculatePerProgress()}%</span>
          </div>
          <Progress value={calculatePerProgress()} />
        </div>

        <Link href={`/workspace/view-course/${courses?.cid}`}>
          <Button className="w-full mt-4 flex items-center justify-center gap-2 cursor-pointer">
            <PlayCircle className="h-5 w-5" />
            Continue Learning
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default EnrolledCourseCard;
