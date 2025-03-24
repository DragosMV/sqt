"use client";
import { useState, useEffect, useCallback } from "react"; // Import useEffect
import TrueFalseQuestion from "@/components/TrueFalseQuestion";
import { useAuth } from "@/context/AuthContext";
import { updateUserField, fetchUserHighestStage, getUserField, getCourse1StageAttempts, updateCourse1StageAttempts } from "@/utils/database_helpers";
import { toast } from "react-hot-toast"; 
import { Toaster } from "react-hot-toast"; 

export default function Stage8Page() {
  const [isQuestion1Correct, setIsQuestion1Correct] = useState<boolean | null>(null);
  const [isQuestion2Correct, setIsQuestion2Correct] = useState<boolean | null>(null);

  const authContext = useAuth();

  const { currentUser } = authContext || {};

  const handleAnswerCheck = useCallback(async () => {
    try {
      if (!currentUser) return;
      const highestStage = await fetchUserHighestStage(currentUser.uid, "course1");
  
      // Check if the next stage (9) is bigger than the current highest stage user reached
      if (9 > highestStage) {
        await updateUserField(currentUser.uid, "course1Stage", 9);
      }
      let currentAttempts = await getCourse1StageAttempts(currentUser.uid, 8);
      if (!currentAttempts) currentAttempts = 0;
      let pointsEarned = 10; // 
      if (currentAttempts > 999) pointsEarned = 0; // user already answered question correctly
      // award 10 points when both questions are answered correctly.
      // loop through all selected fields and update points
      const fieldsToUpdate: string[] = ['points', 'knowledgePoints', 'conceptUnderstandingPoints']
      for (const field of fieldsToUpdate) {
        const currentValueRaw = await getUserField(currentUser.uid, field);
        const currentValue = currentValueRaw !== null ? Number(currentValueRaw) : 0;
        await updateUserField(currentUser.uid, field, currentValue + pointsEarned);
      }
      
      await updateCourse1StageAttempts(currentUser.uid, 8, 1000);

      toast.success(`Correct! You earned ${pointsEarned ?? 0} points! You can now proceed to the next stage.`); // Modern notification
    } catch (error) {
      console.error("Error updating user progress:", error);
      toast.error("An error occurred. Please try again.");
    }
  }, [currentUser]);

  // useEffect to trigger stage progression when both answers are correct
  useEffect(() => {
    if (isQuestion1Correct && isQuestion2Correct) {
      handleAnswerCheck();
    }
  }, [isQuestion1Correct, isQuestion2Correct, handleAnswerCheck]); // ensures this runs when either value changes

  return (
    <div className="flex flex-col items-center bg-gray-50 space-y-8 p-8">
      <Toaster/>
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