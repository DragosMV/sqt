"use client"
import React from 'react';
import MatchingQuestion from "@/components/MatchingQuestion";
import { useAuth } from "@/context/AuthContext";
import { handleIncorrectAnswer} from "@/utils/answerHandlers";

const matchingPairs1 = [
  { id: "1", term: "Logic Checks", definition: "Verify if the system performs correct calculations and follows the expected path with valid inputs." },
  { id: "2", term: "Boundary checks", definition: "Test how the system handles typical, edge case, and invalid inputs." },
  { id: "3", term: "Error handling", definition: "Check the system properly handles errors. Verify the behaviour is the expected one." },
];

export default function Stage7Page() {
  const authContext = useAuth();
  const { currentUser } = authContext || {};
  const stageNumber = 7;
  
  return (
    <div>
      <MatchingQuestion question="Match the definition to the correct term" pairs={matchingPairs1} stageNumber={stageNumber}
      onIncorrectAnswer={() => handleIncorrectAnswer(currentUser, stageNumber)}/>
    </div>
  );
}
