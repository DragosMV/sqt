"use client"
import { useState } from 'react';

interface MultipleChoiceQuestionProps {
  question: string;
  correctAnswer: string;
  answerVariants: string[];
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, correctAnswer, answerVariants }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setFeedbackMessage('Correct! You can now proceed to the next stage.');
    } else {
      setFeedbackMessage('Incorrect! Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{question}</h1>
      <div className="w-full max-w-md">
        {answerVariants.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            className={`w-full py-2 my-2 border rounded-lg ${selectedAnswer === answer ? 'bg-gray-200' : ''}`}>
            {answer}
          </button>
        ))}
      </div>
      {feedbackMessage && (
        <div className="mt-4 p-4 text-center bg-blue-100 text-blue-800 rounded">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
