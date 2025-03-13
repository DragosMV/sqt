"use client";
import React from 'react';
import Button from './Button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 

export default function Hero() {
  const authContext = useAuth();

  return (
    <div className='py-4 md:py-10 flex flex-col gap-8 sm:gap-10'>
      <h1 className={`text-5xl sm:text-6xl md:text-7xl text-center font-bold text-#1ABC9C-300`}>
        Software Quality Temple
        <span className='textGradient'> helps you</span> improve your <span className='textGradient'>software testing</span> skills in a fun way!
      </h1>
      <p className='text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[700px]'>
        The Temple allows you to practice for as long as you want, being able to
        <span className='font-semibold'> pause and resume at any time!</span>
      </p>

      {/* Conditional Rendering */}
      {authContext?.currentUser ? (
        // user is logged in, display a welcome message
        <div className="text-center text-lg sm:text-xl md:text-2xl">
          Hi, you are already logged in using the email:{" "}
          <span className="font-semibold">{authContext.currentUser.email}</span>
        </div>
      ) : (
        // user is not logged in, display the Sign Up and Login buttons
        <div className='grid grid-cols-2 gap-4 w-fit mx-auto'>
          <Link href={'/summary'}>
            <Button text="Sign Up" />
          </Link>
          <Link href={'/summary'}>
            <Button text="Login" dark />
          </Link>
        </div>
      )}
    </div>
  );
}