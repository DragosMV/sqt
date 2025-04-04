"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import Button from './Button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 
import { getUserField } from '@/utils/database_helpers';

export default function Hero() {
  const [participantNumber, setparticipantNumber] = useState<string>('');
  const authContext = useAuth();

  if (authContext === null) {
    throw new Error('Auth context is missing!');
  }

  const { currentUser } = authContext;
  useEffect(() => {
      const fetchUserData = async () => {
        try {
          if (currentUser) {
          const participantNumber = await getUserField(currentUser.uid, "participantNumber");
          setparticipantNumber(participantNumber);
         }
        }
        catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }, [currentUser]);

  return (
    <div className='mt-12 py-4 md:py-10 flex flex-col gap-8 sm:gap-10'>
      <h1 className={`text-5xl sm:text-6xl md:text-7xl text-center font-bold text-#1ABC9C-300`}>
        Software Quality Temple
        <span className='textGradient'> helps you</span> improve your <span className='textGradient'>software testing</span> skills in a gamified way!
      </h1>
      <p className='mt-8 text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[700px]'>
        The Temple guides you through the content in small chunks at a time,
        <span className='font-semibold'> with the ability to pause and resume as you go!</span>
      </p>

      {/* Conditional Rendering */}
      {authContext?.currentUser ? (
        // user is logged in, display a welcome message
        <div className="text-center text-lg sm:text-xl md:text-2xl">
          Hi, you are already logged in. Your participant number is:{" "}
          <span className="font-semibold">{participantNumber}</span>
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