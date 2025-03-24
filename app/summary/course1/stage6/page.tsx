"use client"
import React from 'react';
import MatchingQuestion from "@/components/MatchingQuestion";
import { useAuth } from "@/context/AuthContext";
import { handleIncorrectAnswer} from "@/utils/answerHandlers";

const matchingPairs1 = [
  { id: "1", term: "Mocking", definition: "Replaces dependencies in tests" },
  { id: "2", term: "Assertion", definition: "Checks expected vs actual result" },
  { id: "3", term: "Testing Framework", definition: "Collection of methods designed to implement tests efficiently" },
];

export default function Stage6Page() {
  const authContext = useAuth();
    const { currentUser } = authContext || {};
    const stageNumber = 6;
    

  return (
    <div>
      <MatchingQuestion question="Match the definition to the correct term" pairs={matchingPairs1} stageNumber={stageNumber}         
      onIncorrectAnswer={() => handleIncorrectAnswer(currentUser, stageNumber)}/>
    </div>
  );
}
