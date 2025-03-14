"use client"
import React from 'react';
import MatchingQuestion from "@/components/MatchingQuestion";
import { useAuth } from "@/context/AuthContext";
import { updateCourse1StageAttempts, getCourse1StageAttempts } from "@/utils/database_helpers";

const matchingPairs1 = [
  { id: "1", term: "Logic Checks", definition: "Verify if the system performs correct calculations and follows the expected path with valid inputs." },
  { id: "2", term: "Boundary checks", definition: "Test how the system handles typical, edge case, and invalid inputs." },
  { id: "3", term: "Error handling", definition: "Check the system properly handles errors. Verify the behaviour is the expected one." },
];

export default function Stage7Page() {
  const authContext = useAuth();
  const { currentUser } = authContext || {};
  const stageNumber = 7;
  
  const handleIncorrectAnswer = async () => {
    if (!currentUser) return;

    try {
      // Get the current attempt count
      const currentAttempts = await getCourse1StageAttempts(currentUser.uid, stageNumber);
      
      if (currentAttempts !== null) {
        // Update the attempt count (+1)
        await updateCourse1StageAttempts(currentUser.uid, stageNumber, currentAttempts + 1);
      } else {
        console.error("Could not retrieve current attempt count.");
      }
    } catch (error) {
      console.error("Error updating attempt count:", error);
    }
  };
  return (
    <div>
      <MatchingQuestion question="Match the definition to the correct term" pairs={matchingPairs1} stageNumber={7} onIncorrectAnswer={handleIncorrectAnswer} />
    </div>
  );
}
