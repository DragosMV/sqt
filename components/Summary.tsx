'use client'
import React from 'react'
import Loading from './Loading'
import Login from './Login'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link';

export default function Summary() {
  const authContext = useAuth()
  
  if (authContext === null) {
    throw new Error('Auth context is missing!');
  }
  const { currentUser, loading } = authContext;

  if (loading) {
    return <Loading/>
  }
  if (!currentUser) {
    return <Login/>
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <div className="w-full flex justify-center p-4">
      <Link href={'/profile'}>
        <button 
          onClick={() => console.log("Profile clicked")}
          className="bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-700 font-semibold"
        >
          Profile Page
        </button>
      </Link>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Choose your course
      </h2>
      <div className="w-full max-w-md space-y-3">
        {['Course 1', 'Course 2', 'Course 3'].map((course, index) => (
          <button
            key={course}
            className="w-full bg-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 border-2 border-purple-100 hover:border-purple-200 text-lg font-semibold text-gray-700 flex items-center justify-between"
          >
            <span>{course}</span>
            <span className="text-purple-500 text-2xl">
              {['🧪', '🔍', '🛠️'][index]}
            </span>
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-purple-600">x/3 Courses</span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div className="h-full w-1/3 bg-purple-500 rounded-full transition-all duration-300"></div>
        </div>
      </div>
    </div>
  )
}
