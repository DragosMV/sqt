"use client";

import { useState } from "react";

interface TrueFalseQuestionProps {
  question: string;
  correctAnswer: boolean;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, correctAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleAnswerClick = (answer: boolean) => {
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setFeedbackMessage("Correct! You can now proceed to the next stage.");
    } else {
      setFeedbackMessage("Incorrect! Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{question}</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => handleAnswerClick(true)}
          className={`px-6 py-2 border rounded-lg ${
            selectedAnswer === true ? "bg-gray-300" : ""
          }`}
        >
          True
        </button>
        <button
          onClick={() => handleAnswerClick(false)}
          className={`px-6 py-2 border rounded-lg ${
            selectedAnswer === false ? "bg-gray-300" : ""
          }`}
        >
          False
        </button>
      </div>
      {feedbackMessage && (
        <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
};

export default TrueFalseQuestion;
