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
        question="In the context of unit testing, what does the term 'mocking' refer to?" 
        correctAnswer="Creating objects that simulate the behavior of real objects" 
        answerVariants={["Writing code to test the functionality of the user interface", "Combining multiple unit tests to test a larger feature", 
        "Ensuring that the test code is reviewed for potential bugs", "Creating objects that simulate the behavior of real objects"]}
        stageNumber={stageNumber}
        onIncorrectAnswer={() => handleIncorrectAnswer(currentUser, stageNumber)}/>
    </div>
  );
};

export default Stage4Page;