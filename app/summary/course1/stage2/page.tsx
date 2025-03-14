"use client"
import React from 'react';
import MultipleChoiceQuestion from '@/components/MCQ';
import { useAuth } from "@/context/AuthContext";
import { updateCourse1StageAttempts, getCourse1StageAttempts } from "@/utils/database_helpers";

const Stage2Page: React.FC = () => {
  const authContext = useAuth();
  const { currentUser } = authContext || {};
  const stageNumber = 2;

  const handleIncorrectAnswer = async () => {
    if (!currentUser) return;

    try {
      // Get the current attempt count
      const currentAttempts = await getCourse1StageAttempts(currentUser.uid, stageNumber);
      
      if (currentAttempts !== null) {
        // Update the attempt count (+1)
        await updateCourse1StageAttempts(currentUser.uid, stageNumber, currentAttempts + 1);
      } else {
        console.error("Could not retrieve current attempt count.");
      }
    } catch (error) {
      console.error("Error updating attempt count:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <MultipleChoiceQuestion 
        question="What is the main purpose of unit testing?" 
        correctAnswer="To verify that individual components of code work as expected" 
        answerVariants={["To test the entire application as a whole", "To check how the system performs under load", 
        "To verify that individual components of code work as expected", "To ensure that the database fetches the correct data"]}
        stageNumber={2}
        onIncorrectAnswer={handleIncorrectAnswer}/>
    </div>
  );
};

export default Stage2Page;
