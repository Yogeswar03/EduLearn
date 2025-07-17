import { Button } from '@/components/ui/button';
import axios from 'axios';
import {
  Book,
  LoaderCircleIcon,
  PlayCircleIcon,
  SettingsIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

function CourseCard({ course }) {
  const courseJson = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);

  const onEnrollCourse = async () => {
    try {
      setLoading(true);
      const result = await axios.post('/api/enroll-course', {
        courseId: course?.cid,
      });

      if (result.data.resp) {
        toast.warning('Already Enrolled');
      } else {
        toast.success('Enrolled');
      }
    } catch (e) {
      toast.error('Server side Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="shadow-lg rounded-xl p-4 w-full sm:max-w-[500px] bg-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Image
        src={course?.bannerImageUrl}
        alt={course?.name}
        width={400}
        height={300}
        className="w-full aspect-video rounded-xl object-cover"
      />

      <div className="flex flex-col gap-3 mt-4">
        <h2 className="font-bold text-xl">{courseJson?.name}</h2>
        <p className="line-clamp-3 text-gray-500 text-sm">
          {courseJson?.description}
        </p>

        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <Book className="h-5 w-5 text-primary" />
            {courseJson?.noOfChapters} chapters
          </span>

          {course?.courseContent?.length ? (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onEnrollCourse}
                disabled={loading}
                className="flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <LoaderCircleIcon className="animate-spin h-5 w-5" />
                ) : (
                  <PlayCircleIcon className="h-5 w-5" />
                )}
                Enroll Course
              </Button>
            </motion.div>
          ) : (
            <Link href={`/workspace/edit-course/${course?.cid}`}>
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer"
              >
                <SettingsIcon className="h-5 w-5" />
                Generate Course
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard;
