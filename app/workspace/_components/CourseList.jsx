"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AddNewCourseDialog from './AddNewCourseDialog';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import CourseCard from './CourseCard';

function CourseList() {
    const [courseList, SetCourseList] = useState([]);
    const {user} = useUser();
    useEffect(()=>{
     user&& getCourseList();
    },[user])

    const getCourseList=async()=>{
       const result=await axios.get('/api/courses');
       console.log(result.data);
       SetCourseList(result.data)
       
    }

  return (
    <div className='mt-10'> 
        <h2 className='font-bold text-3xl'>Course List</h2>

        {courseList?.length == 0 ?
         <div className='p-7 flex items-center justify-center flex-col border rounded-xl my-5 bg-gray-100 shadow-sm'>
            <Image src={'/image1.png'} alt='bannerImage' width={150} height={120} className='rounded-xl' />
            <h2 className='my-3 text-xl font-bold'>Look's like you haven't created any courses. </h2>
            <AddNewCourseDialog>
                 <Button className={'p-4 text-md cursor-pointer'}>+ Create Your First Course</Button>
            </AddNewCourseDialog>
        </div> :
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
           {courseList?.map((course, index)=>(
            <CourseCard course={course} key={index} />
           ))}
        </div>
        }
    </div>
  )
}

export default CourseList