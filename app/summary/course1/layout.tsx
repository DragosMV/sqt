"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext'
import { getUserField, updateUserField } from '@/utils/database_helpers';
import Login from "@/components/Login";
import { usePathname } from "next/navigation";

export default function StageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { course: string; stage: string };
}) {
  const authContext = useAuth();
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<number>(1);

  if (!authContext) {
    throw new Error("Auth context is missing!");
  }

  const { currentUser, logout } = authContext;

  if (!currentUser) return <Login />;

  const pathname = usePathname();
  const stageMatch = pathname.match(/stage(\d+)/);
  const stageNumber = stageMatch ? parseInt(stageMatch[1], 10) : 1; // Default to stage 1 if not found

  // Navigation handlers
  const handleNext = async () => {
    const nextStage = stageNumber + 1;
  
    if (stageNumber === 10) {
      await updateUserField(currentUser.uid, "coursesCompleted", (prev: number) => (prev ?? 0) + 1);
      alert("Course completed!");
      router.push("/summary");
    } else {
      await updateUserField(currentUser.uid, `course1Stage`, nextStage);
      router.push(`/summary/course1/stage${nextStage}`);
    }
  };
  
  
  const handlePrevious = async () => {
    if (stageNumber <= 1) return;
  
    const prevStage = stageNumber - 1;
    await updateUserField(currentUser.uid, `course1Stage`, prevStage);
    router.push(`/summary/course1/stage${prevStage}`);
  };
  

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">{children}</main>

    {/* Footer Navigation */}
    <footer className="w-full p-4 flex justify-between">
    {stageNumber > 1 && (
        <button
        onClick={handlePrevious}
        className="px-4 py-2 text-black rounded-lg"
        >
        ⬅️ Previous
        </button>
    )}
    <button
        onClick={handleNext}
        className="ml-auto px-4 py-2 text-black rounded-lg"
    >
        {stageNumber === 10 ? '✅ Complete' : 'Next ➡️'}
    </button>
    </footer>

    </div>
  );
}