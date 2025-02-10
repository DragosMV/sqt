import React from 'react';
import MultipleChoiceQuestion from '@/components/MCQ';

const Stage1Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <MultipleChoiceQuestion 
        question="What is the capital of France?" 
        correctAnswer="Paris" 
        answerVariants={["Paris", "Madrid", "Rome", "Berlin"]} />
    </div>
  );
};

export default Stage1Page;
