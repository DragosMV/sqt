import React from 'react';
import MultipleChoiceQuestion from '@/components/MCQ';

const Stage2Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <MultipleChoiceQuestion 
        question="What is the main purpose of unit testing?" 
        correctAnswer="To verify that individual components of code work as expected" 
        answerVariants={["To test the entire application as a whole", "To check how the system performs under load", 
        "To verify that individual components of code work as expected", "To ensure that the database fetches the correct data"]} />
    </div>
  );
};

export default Stage2Page;
