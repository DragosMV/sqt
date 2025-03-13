"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext'
import {fetchUserHighestStage, updateUserField } from '@/utils/database_helpers';
import Login from "@/components/Login";
import { usePathname } from "next/navigation";
import Loading from '@/components/Loading'

export default function StageLayout({children}: {children: ReactNode}) {
  const authContext = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [highestStageReached, setHighestStageReached] = useState<number | null>(null);

  if (authContext === null) {
    throw new Error('Auth context is missing!');
  }

  const { currentUser, loading } = authContext;

  const stageMatch = pathname.match(/stage(\d+)/);
  const stageNumber = stageMatch ? parseInt(stageMatch[1], 10) : 1; // Default to stage 1 if not found

  // Fetch user's highest unlocked stage
  useEffect(() => {
    const checkStageAccess = async () => {
      if (currentUser) {
        const userStage = await fetchUserHighestStage(currentUser.uid, "course1");
        console.log(userStage)
        setHighestStageReached(userStage);
      // Redirect if the user tries to access a locked stage
      if (stageNumber > userStage) {
        router.push(`/summary/course1/stage${userStage}`);
      }
    }
    };

    checkStageAccess();
  }, [currentUser, stageNumber, router]);

  if (loading) {
    return <Loading/>
  }

  if (!currentUser) {
    return <Login />; // Ensure that if there's no currentUser, we show the Login page
  }

  if (highestStageReached === null) {
    return <Loading />; // Wait until the stage data is loaded
  }

  // Navigation handlers
  const handleNext = async () => {
    const highestStageReached = await fetchUserHighestStage(currentUser.uid, "course1"); // Get latest from DB
    if (stageNumber >= highestStageReached) {
      return alert("You must complete this stage before moving forward!");
    }

    const nextStage = stageNumber + 1;

    if (stageNumber === 10) {
      await updateUserField(currentUser.uid, "coursesCompleted", (prev: number) => (prev ?? 0) + 1);
      alert("Course completed!");
      router.push("/summary");
    } else {
      // Only update stage if moving forward and it's higher than the stored progress
      if (nextStage > highestStageReached) {
        await updateUserField(currentUser.uid, "course1Stage", nextStage);
      }
      router.push(`/summary/course1/stage${nextStage}`);
    }
  };
  
  const handlePrevious = () => {
    if (stageNumber > 1) {
      router.push(`/summary/course1/stage${stageNumber - 1}`);
    } else {
      router.push(`/summary`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
    {/* Main Content */}
    <main className="flex-grow flex items-center justify-center p-6">{children}</main>

    {/* Footer Navigation */}
    <footer className="w-full p-4 flex justify-between">
    
    <button onClick={handlePrevious} className="px-4 py-2 text-black rounded-lg">
      {stageNumber === 1 ? '⬅️ Dashboard' : '⬅️ Previous'}
    </button>
    <button onClick={handleNext} className="ml-auto px-4 py-2 text-black rounded-lg">
      {stageNumber === 10 ? '✅ Complete' : 'Next ➡️'}
    </button>
    </footer>
    </div>
  );
}