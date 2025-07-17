"use client";

import { Button } from '@/components/ui/button';
import { SelectedCourseIndexContext } from '@/context/SelectedCourseIndexContext';
import axios from 'axios';
import { CheckCircle2Icon, Loader2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import YouTube from 'react-youtube';
import { toast } from 'sonner';

function ChapterContent({ courseInfo, refreshData }) {
  const { courseId } = useParams();
  const router = useRouter();

  const courses = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourses;
  const courseContent = courses?.courseContent;
  const completedChapters = enrollCourse?.completedChapters ?? [];

  const { selectedCourseIndex } = useContext(SelectedCourseIndexContext);
  const videoData = courseContent?.[selectedCourseIndex]?.youtubeVideo || [];
  const topics = courseContent?.[selectedCourseIndex]?.CourseContent?.topics || [];

  const [loading, setLoading] = useState(false);

  const markChapterCompleted = async () => {
    try {
      setLoading(true);
      const updatedChapters = [...completedChapters, selectedCourseIndex];
      await axios.put('/api/enroll-course', {
        courseId,
        completedChapters: updatedChapters,
      });
      await refreshData();
      toast.success('Marked Chapter Completed!');
    } catch (err) {
      toast.error('Error updating progress');
    } finally {
      setLoading(false);
    }
  };

  const markChapterInCompleted = async () => {
    try {
      setLoading(true);
      const updatedChapters = completedChapters.filter(
        (item) => item !== selectedCourseIndex
      );
      await axios.put('/api/enroll-course', {
        courseId,
        completedChapters: updatedChapters,
      });
      await refreshData();
      toast.success('Marked Chapter Incomplete!');
    } catch (err) {
      toast.error('Error updating progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <Button className={'cursor-pointer'} variant="outline" onClick={() => router.push('/workspace')} >
          Go to Workspace
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
        <h2 className="font-bold text-2xl">
          {selectedCourseIndex + 1}. {courseContent?.[selectedCourseIndex]?.CourseContent?.chapterName}
        </h2>

        {!completedChapters.includes(selectedCourseIndex) ? (
          <Button onClick={markChapterCompleted} disabled={loading} className={'cursor-pointer'}>
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2Icon />} Mark As Completed
          </Button>
        ) : (
          <Button variant="outline " className={'cursor-pointer'} onClick={markChapterInCompleted} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <X />} Mark Incomplete
          </Button>
        )}
      </div>

  
      <div className="mb-6">
        <h3 className="font-bold text-xl mb-2">Related Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videoData.slice(0, 2).map((video, index) => (
            <div key={index} className="w-full aspect-video">
              <YouTube
                videoId={video?.videoId}
                opts={{
                  width: '100%',
                  height: '100%',
                }}
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      </div>

    
      <div>
        <h3 className="font-bold text-xl mb-4">Topics</h3>
        <div className="space-y-6">
          {topics.map((topic, index) => (
            <div key={index} className="bg-secondary rounded-xl p-4 shadow-sm">
              <h4 className="font-bold text-lg mb-2">
                {index + 1}. {topic?.topic}
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: topic?.content }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChapterContent;
