"use client"
import React, {useEffect} from 'react';
import { updateUserField, fetchUserHighestStage } from "@/utils/database_helpers";
import { useAuth } from "@/context/AuthContext";

export default function Stage5Page() {
  const authContext = useAuth();
  const course = 'course1'; 

  const { currentUser } = authContext || {};

  useEffect(() => {
    const handleStageUpdate = async () => {
      if (!currentUser) return;
      const userHighestStage = await fetchUserHighestStage(currentUser.uid, course);

      if (userHighestStage === 5) {
        await updateUserField(currentUser.uid, `${course}Stage`,6) 
      }
    };
    handleStageUpdate();
  }, [course, currentUser]);

  return (
    <div className="flex items-center justify-center bg-black">
      <iframe
        width="1200"
        height="600"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=fJ6tLpKaifk9OQpB"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg shadow-lg block"
      />
    </div>
  );
}