"use client"
import React from 'react';
import MatchingQuestion from "@/components/MatchingQuestion";
import { useAuth } from "@/context/AuthContext";
import { updateCourse1StageAttempts, getCourse1StageAttempts } from "@/utils/database_helpers";

const matchingPairs1 = [
  { id: "1", term: "Mocking", definition: "Replaces dependencies in tests" },
  { id: "2", term: "Assertion", definition: "Checks expected vs actual result" },
  { id: "3", term: "Test Fixture", definition: "Sets up test data/environment" },
];

export default function Stage6Page() {
  const authContext = useAuth();
    const { currentUser } = authContext || {};
    const stageNumber = 6;
    
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
      <MatchingQuestion question="Match the definition to the correct term" pairs={matchingPairs1} stageNumber={6} onIncorrectAnswer={handleIncorrectAnswer} />
    </div>
  );
}
