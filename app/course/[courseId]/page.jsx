"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Menu } from 'lucide-react';

import AppHeader from '@/app/workspace/_components/AppHeader';
import ChapterListSidebar from '../_components/ChapterListSidebar';
import ChapterContent from '../_components/ChapterContent';

function Course() {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (courseId) getEnrolledCoursebyId();
  }, [courseId]);

  const getEnrolledCoursebyId = async () => {
    try {
      const result = await axios.get(`/api/enroll-course?courseId=${courseId}`);
      setCourseInfo(result.data);
    } catch (error) {
      console.error("Failed to fetch course info:", error);
    }
  };

  if (!courseInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        Loading course...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <div className="flex items-center justify-between px-4 py-2 shadow-sm bg-white sticky top-0 z-40">
        <Image
          onClick={() => router.push('/workspace')}
          src="/edu_logo.png"
          width={160}
          height={40}
          alt="logo"
          className="cursor-pointer"
        />
        <AppHeader hideSidebar />
        <button
          className="lg:hidden p-2 rounded hover:bg-gray-100 cursor-pointer"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>


      <div className="flex flex-1 relative overflow-hidden">
      
        <aside
          className={`fixed z-30 inset-y-0 left-0 w-80 bg-white border-r shadow-md transform transition-transform duration-300 lg:static lg:translate-x-0 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <ChapterListSidebar courseInfo={courseInfo} />
        </aside>

        
        <main className="flex-1 overflow-y-auto p-4">
          <ChapterContent
            courseInfo={courseInfo}
            refreshData={getEnrolledCoursebyId}
          />
        </main>
      </div>
    </div>
  );
}

export default Course;
