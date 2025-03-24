"use client"
import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { updateUserField, fetchUserHighestStage } from "@/utils/database_helpers";
import Loading from '@/components/Loading';
import { handleCorrectAnswer } from "@/utils/answerHandlers";


interface MultipleChoiceQuestionProps {
  question: string;
  correctAnswer: string;
  answerVariants: string[];
  stageNumber: number;
  onIncorrectAnswer?: () => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, correctAnswer, answerVariants, stageNumber, onIncorrectAnswer}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const authContext = useAuth();

  if (!authContext?.currentUser) {
    return <Loading/>;
  }

  const { currentUser } = authContext;

  const handleAnswerClick = async (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      const points = await handleCorrectAnswer(currentUser, stageNumber);
      setFeedbackMessage(`Correct! You earned ${points ?? 0} points! You can now proceed to the next stage.`);
      // Fetch the user's current highest stage
      const highestStage = await fetchUserHighestStage(currentUser.uid, "course1");
      // Only update if the user is progressing to a new stage
      if (stageNumber + 1 > highestStage) {
        await updateUserField(currentUser.uid, "course1Stage", stageNumber + 1);
      }
    } else {
      setFeedbackMessage('Incorrect! Please try again.');
      if (onIncorrectAnswer) onIncorrectAnswer(); // function to update attempts
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
        <div className={`mt-4 p-4 text-center rounded ${
          feedbackMessage.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {feedbackMessage}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
