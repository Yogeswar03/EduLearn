import { Gift } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion'; 

function ChapterTopicList({ course }) {
  const courseLayout = course?.courseJson?.course;

  if (!courseLayout?.chapters?.length) return null;

  return (
    <div className="px-4 sm:px-10">
      <h2 className="font-bold text-3xl mt-10 text-center">
        Chapters & Topics
      </h2>

      <div className="flex flex-col items-center justify-center mt-10 gap-16">
        {courseLayout.chapters.map((chapter, chapterIndex) => (
          <motion.div
            key={chapterIndex}
            className="flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: chapterIndex * 0.1 }}
          >
          
            <div className="p-4 border shadow rounded-xl bg-purple-600 text-white w-full max-w-2xl text-center">
              <h2 className="text-lg font-semibold">
                Chapter {chapterIndex + 1}
              </h2>
              <h2 className="text-xl font-bold mt-1">{chapter.chapterName}</h2>
              <div className="text-sm flex justify-between mt-2">
                <span>Duration: {chapter.duration}</span>
                <span>Topics: {chapter.topics?.length}</span>
              </div>
            </div>

          
            <div className="relative mt-8 w-full max-w-2xl">
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-300 -translate-x-1/2 z-0"></div>

              {chapter?.topics.map((topic, index) => (
                <motion.div
                  key={index}
                  className="relative z-10 flex items-center justify-between mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {index % 2 === 0 ? (
                    <>
                      <div className="w-[45%] text-right pr-4 text-sm text-gray-700">
                        {topic}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mx-2 text-sm font-semibold text-gray-700">
                        {index + 1}
                      </div>
                      <div className="w-[45%]"></div>
                    </>
                  ) : (
                    <>
                      <div className="w-[45%]"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mx-2 text-sm font-semibold text-gray-700">
                        {index + 1}
                      </div>
                      <div className="w-[45%] pl-4 text-sm text-gray-700">
                        {topic}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}

              
              <div className="flex justify-center items-center mt-8">
                <motion.div
                  whileHover={{ rotate: 20 }}
                  className="rounded-full bg-gray-300 h-14 w-14 flex items-center justify-center text-gray-600"
                >
                  <Gift size={24} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}

        
        <motion.div
          className="p-4 border shadow rounded-xl bg-green-600 text-white w-[200px] text-center"
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold">Finish</h2>
        </motion.div>
      </div>
    </div>
  );
}

export default ChapterTopicList;
