import React, { useContext } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectedCourseIndexContext } from '@/context/SelectedCourseIndexContext';

function ChapterListSidebar({ courseInfo }) {
  const courses = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourses;
  const courseContent = courses?.courseContent || [];
  const completedChapters = enrollCourse?.completedChapters ?? [];

  const { selectedCourseIndex, setSelectedCourseIndex } = useContext(SelectedCourseIndexContext);

  return (
    <div className="p-5 w-80 min-w-[20rem] bg-secondary h-screen overflow-y-auto border-r shadow-sm">
      <h2 className="font-bold text-xl mb-4 sticky top-0 bg-secondary z-10 py-2">
        Chapters ({courseContent.length})
      </h2>

      <Accordion
        type="single"
        collapsible
        onValueChange={(val) => {
          const index = courseContent.findIndex(
            (c) => c.CourseContent?.chapterName === val
          );
          if (index !== -1) setSelectedCourseIndex(index);
        }}
      >
        {courseContent.length > 0 ? (
          courseContent.map((chapter, index) => {
            const isCompleted = completedChapters.includes(index);
            const isSelected = selectedCourseIndex === index;

            return (
              <AccordionItem
                key={index}
                value={chapter?.CourseContent?.chapterName || `Chapter ${index + 1}`}
                className={`rounded-lg mb-2 ${
                  isSelected ? 'ring-2 ring-purple-300 bg-white' : 'bg-white'
                }`}
              >
                <AccordionTrigger
                  className={`text-md px-4 py-2 rounded-t-lg ${
                    isCompleted ? 'bg-green-100 text-green-800' : 'text-gray-800'
                  }`}
                >
                  {index + 1}. {chapter?.CourseContent?.chapterName || `Untitled Chapter ${index + 1}`}
                </AccordionTrigger>

                <AccordionContent className="bg-gray-50 px-4 py-2">
                  {chapter?.CourseContent?.topics?.map((topic, i) => (
                    <div
                      key={i}
                      className="text-sm py-1 pl-2 border-l-2 border-purple-200 text-gray-700"
                    >
                      • {topic?.topic}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground mt-4">No chapters available.</p>
        )}
      </Accordion>
    </div>
  );
}

export default ChapterListSidebar;
