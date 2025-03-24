"use client"
import React from 'react';
import MultipleChoiceQuestion from '@/components/MCQ';
import { useAuth } from "@/context/AuthContext";
import { handleIncorrectAnswer} from "@/utils/answerHandlers";

const Stage4Page: React.FC = () => {
  const authContext = useAuth();
  const { currentUser } = authContext || {};
  const stageNumber = 4;

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <MultipleChoiceQuestion 
        question="What is an advantage of unit testing?" 
        correctAnswer="Enables early detection of issues during development" 
        answerVariants={["It ensures the whole application can run correctly", "It evaluates the resources used by your code", 
        "It evaluates the time it takes for your code to run", "Enables early detection of issues during development"]}
        stageNumber={stageNumber}
        onIncorrectAnswer={() => handleIncorrectAnswer(currentUser, stageNumber)}/>
    </div>
  );
};

export default Stage4Page;