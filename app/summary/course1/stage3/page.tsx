import React from 'react';
import MultipleChoiceQuestion from '@/components/MCQ';

const Stage3Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <MultipleChoiceQuestion 
        question="Which of the following is a key characteristic of a good unit test?" 
        correctAnswer="It runs quickly and in isolation from other tests" 
        answerVariants={["It runs quickly and in isolation from other tests", "It can only be executed manually", 
        "It depends on external systems like databases and APIs", "It covers multiple components at once to improve efficiency"]} 
        stageNumber={3}/>
    </div>
  );
};

export default Stage3Page;
