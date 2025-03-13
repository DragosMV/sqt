import React from 'react';
import MultipleChoiceQuestion from '@/components/MCQ';

const Stage4Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <MultipleChoiceQuestion 
        question="In the context of unit testing, what does the term 'mocking' refer to?" 
        correctAnswer="Creating objects that simulate the behavior of real objects" 
        answerVariants={["Writing code to test the functionality of the user interface", "Combining multiple unit tests to test a larger feature", 
        "Ensuring that the test code is reviewed for potential bugs", "Creating objects that simulate the behavior of real objects"]}
        stageNumber={4} />
    </div>
  );
};

export default Stage4Page;