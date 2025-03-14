"use client"
import React from 'react';
import MultipleChoiceQuestion from '@/components/MCQ';
import { useAuth } from "@/context/AuthContext";
import { updateCourse1StageAttempts, getCourse1StageAttempts } from "@/utils/database_helpers";

const Stage3Page: React.FC = () => {
  const authContext = useAuth();
  const { currentUser } = authContext || {};
  const stageNumber = 3;
  
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
        question="Which of the following is a key characteristic of a good unit test?" 
        correctAnswer="It runs quickly and in isolation from other tests" 
        answerVariants={["It runs quickly and in isolation from other tests", "It can only be executed manually", 
        "It depends on external systems like databases and APIs", "It covers multiple components at once to improve efficiency"]} 
        stageNumber={3}
        onIncorrectAnswer={handleIncorrectAnswer}/>
    </div>
  );
};

export default Stage3Page;
