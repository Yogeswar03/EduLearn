"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import {
  Book,
  Clock,
  Loader2Icon,
  PlayCircleIcon,
  SparklesIcon,
  TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

function CourseInfo({ course, viewCourse }) {
  const courseLayout = course?.courseJson?.course;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const GenerateCourseContent = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/generate-course-content', {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
      });
      console.log(result.data);
      toast.success("Course Generated Successfully");
      router.replace('/workspace');
    } catch (e) {
      console.error(e);
      toast.error("Server side error. Try Again!");
    } finally {
      setLoading(false);
    }
  };

  const getTotalDuration = () => {
    const chapters = courseLayout?.chapters || [];
    let totalMinutes = 0;

    chapters.forEach((chapter) => {
      const durationStr = chapter.duration.toLowerCase();
      const hourMatch = durationStr.match(/(\d+)\s*hour/);
      const minuteMatch = durationStr.match(/(\d+)\s*minute/);

      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
      const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;

      totalMinutes += hours * 60 + minutes;
    });

    const finalHours = Math.floor(totalMinutes / 60);
    const finalMinutes = totalMinutes % 60;

    return `${finalHours > 0 ? `${finalHours} hour${finalHours > 1 ? 's' : ''}` : ''}${finalHours > 0 && finalMinutes > 0 ? ' ' : ''}${finalMinutes > 0 ? `${finalMinutes} minute${finalMinutes > 1 ? 's' : ''}` : ''}`;
  };

  return (
    <motion.div
      className="md:flex gap-5 justify-between p-5 rounded-2xl shadow-md bg-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-3 flex-1">
        <h2 className="font-bold text-3xl">{courseLayout?.name}</h2>
        <p className="line-clamp-2 text-gray-500">{courseLayout?.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-3">
          {[{
            icon: <Clock className="text-blue-500" />,
            label: 'Duration',
            value: getTotalDuration()
          }, {
            icon: <Book className="text-green-500" />,
            label: 'Chapters',
            value: course?.noOfChapters
          }, {
            icon: <TrendingUp className="text-red-500" />,
            label: 'Difficulty Level',
            value: course?.level
          }].map((info, i) => (
            <motion.div
              key={i}
              className="flex gap-4 items-center p-4 rounded-xl shadow-sm border bg-gray-50"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {info.icon}
              <section>
                <h2 className="font-semibold text-sm text-gray-800">{info.label}</h2>
                <p className="text-gray-600">{info.value}</p>
              </section>
            </motion.div>
          ))}
        </div>

        <div className="mt-5">
          {!viewCourse ? (
            <Button onClick={GenerateCourseContent} disabled={loading} className="w-full sm:w-fit cursor-pointer">
              {loading ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : (
                <SparklesIcon className="mr-2" />
              )}
              Generate Content
            </Button>
          ) : (
            <Link href={`/course/${course?.cid}`}>
              <Button className="w-full sm:w-fit cursor-pointer">
                <PlayCircleIcon className="mr-2" />
                Continue Course
              </Button>
            </Link>
          )}
        </div>
      </div>

      <motion.div
        className="mt-6 md:mt-0 md:ml-5 flex-shrink-0"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={course?.bannerImageUrl}
          alt="Course banner"
          width={400}
          height={300}
          className="rounded-2xl w-full h-[240px] object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

export default CourseInfo;
