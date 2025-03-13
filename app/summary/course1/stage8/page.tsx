"use client";

import { useState, useEffect } from "react"; // Import useEffect
import TrueFalseQuestion from "@/components/TrueFalseQuestion";
import { useAuth } from "@/context/AuthContext";
import { updateUserField, fetchUserHighestStage } from "@/utils/database_helpers";
import Loading from "@/components/Loading";

export default function Stage8Page() {
  const [isQuestion1Correct, setIsQuestion1Correct] = useState<boolean | null>(null);
  const [isQuestion2Correct, setIsQuestion2Correct] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authContext = useAuth();

  if (!authContext?.currentUser) {
    return <Loading />;
  }

  const { currentUser } = authContext;

  const handleAnswerCheck = async () => {
    setIsLoading(true);
    try {
      const highestStage = await fetchUserHighestStage(currentUser.uid, "course1");

      // check if the next stage (9) is bigger than the current highest stage user reached. if it is, allow user to advance to next stage
      if (9 > highestStage) {
        await updateUserField(currentUser.uid, "course1Stage", 9);
      }
      alert("Both answers are correct! You can now proceed to the next stage.");
    } catch (error) {
      console.error("Error updating user progress:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to trigger stage progression when both answers are correct
  useEffect(() => {
    if (isQuestion1Correct && isQuestion2Correct) {
      handleAnswerCheck();
    }
  }, [isQuestion1Correct, isQuestion2Correct]); // ensures this runs when either value changes

  return (
    <div className="flex flex-col items-center bg-gray-50 space-y-8 p-8">
      <TrueFalseQuestion
        question="Unit tests should test multiple components at once."
        correctAnswer={false}
        onAnswerCheck={(isCorrect) => setIsQuestion1Correct(isCorrect)}
      />
      <TrueFalseQuestion
        question="Mocking is used to replace dependencies during testing."
        correctAnswer={true}
        onAnswerCheck={(isCorrect) => setIsQuestion2Correct(isCorrect)}
      />
    </div>
  );
}