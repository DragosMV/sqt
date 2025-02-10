'use client'
import React from 'react'
import Loading from './Loading'
import Login from './Login'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link';
import { getUserField } from '@/utils/database_helpers';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Summary() {
  const authContext = useAuth()
  const router = useRouter();
  const [coursesCompleted, setCoursesCompleted] = useState<number>(0);

  // State to store the user's current stage in each course
  const [courseStages, setCourseStages] = useState<{ [key: string]: number }>({
    course1: 1,
    course2: 1,
    course3: 1,
  });
  
  if (authContext === null) {
    throw new Error('Auth context is missing!');
  }

  const { currentUser, loading } = authContext;

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        // Get course stages
        const course1Stage = await getUserField(currentUser.uid, "course1Stage");
        const course2Stage = await getUserField(currentUser.uid, "course2Stage");
        const course3Stage = await getUserField(currentUser.uid, "course3Stage");

        setCourseStages({
          course1: course1Stage ?? 1,
          course2: course2Stage ?? 1,
          course3: course3Stage ?? 1,
        });

        // Get total completed courses
        const completed = await getUserField(currentUser.uid, "coursesCompleted");
        setCoursesCompleted(completed ?? 0);
      };
      fetchData();
    }
  }, []);

  if (loading) {
    return <Loading/>
  }
  if (!currentUser) {
    return <Login/>
  }

  const progressWidth = `${(coursesCompleted / 3) * 100}%`; // Dynamic progress bar width

  // Function to handle navigation
  const handleCourseClick = (course: string) => {
    const stage = courseStages[course] || 1;
    router.push(`/summary/${course}/stage${stage}`);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <div className="w-full flex justify-center p-4">
      <Link href={'/profile'}>
        <button 
          onClick={() => console.log("Profile clicked")}
          className="bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-700 font-semibold">
          Profile Page
        </button>
      </Link>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Choose your course
      </h2>

    <div className="w-full max-w-md space-y-3">
        {["course1", "course2", "course3"].map((course, index) => (
          <button
            key={course}
            onClick={() => handleCourseClick(course)}
            className="w-full bg-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 border-2 
            border-purple-100 hover:border-purple-200 text-lg font-semibold text-gray-700 flex items-center justify-between">
            <span>Course {index + 1}</span>
            <span className="text-purple-500 text-2xl">
              {["🧪", "🔍", "🛠️"][index]}
            </span>
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-purple-600">{coursesCompleted}/3 Courses</span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div className="h-full w-1/3 bg-purple-500 rounded-full transition-all duration-300" style={{ width: progressWidth }} ></div>
        </div>
      </div>
    </div>
  )
}
