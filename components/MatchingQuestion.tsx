"use client";
import { useState, useEffect } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragEndEvent } from "@dnd-kit/core";
import { updateUserField, fetchUserHighestStage } from "@/utils/database_helpers";
import { useAuth } from "@/context/AuthContext";
import Loading from '@/components/Loading';

interface MatchingPair {
  id: string;
  term: string;
  definition: string;
}

interface MatchingQuestionProps {
  question: string;
  pairs: MatchingPair[];
  stageNumber: number;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({ question, pairs, stageNumber }) => {
  const shuffledDefinitions = [...pairs].sort(() => Math.random() - 0.5);
  const [userMatches, setUserMatches] = useState<MatchingPair[]>(shuffledDefinitions);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authContext = useAuth();

  if (!authContext?.currentUser) {
    return <Loading/>;
  }

  const { currentUser } = authContext;

  useEffect(() => {
    const updateHeight = () => {
      const termElements = document.querySelectorAll(".term-item");
      const definitionElements = document.querySelectorAll(".definition-item");
      const heights = [...termElements, ...definitionElements].map((el) => el.getBoundingClientRect().height);
      setMaxHeight(Math.max(...heights));
    };
    
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [userMatches]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = userMatches.findIndex((pair) => pair.id === active.id);
    const newIndex = userMatches.findIndex((pair) => pair.id === over.id);

    setUserMatches(arrayMove(userMatches, oldIndex, newIndex));
  };

  const checkAnswers = () => {
    return userMatches.every((pair, index) => pair.definition === pairs[index].definition);
  };

  const handleCheckAnswers = async () => {
    setIsLoading(true);
    try {
      const isCorrect = checkAnswers();
      if (isCorrect) {
        setFeedbackMessage('Correct! You can now proceed to the next stage.');

        // Fetch the user's current highest stage
        const highestStage = await fetchUserHighestStage(currentUser.uid, "course1");

        // Only update if the user is progressing to a new stage
        if (stageNumber + 1 > highestStage) {
          await updateUserField(currentUser.uid, "course1Stage", stageNumber + 1);
        }
      } else {
        setFeedbackMessage('Incorrect! Please try again.');
      }
    } catch (error) {
      console.error("Error updating user progress:", error);
      setFeedbackMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">{question}</h2>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold mb-2 text-center">Terms</h3>
            {pairs.map((pair) => (
              <div
                key={pair.id}
                className="p-3 bg-blue-200 rounded-md text-center flex items-center justify-center term-item"
                style={{ minHeight: maxHeight }}>
                {pair.term}
              </div>
            ))}
          </div>

          <SortableContext items={userMatches.map((pair) => pair.id)}>
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold mb-2 text-center">Definitions</h3>
              {userMatches.map((pair) => (
                <DraggableItem key={pair.id} id={pair.id} text={pair.definition} maxHeight={maxHeight} />
              ))}
            </div>
          </SortableContext>
        </div>
      </DndContext>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleCheckAnswers}
          disabled={isLoading}
          className={`px-6 py-2 bg-green-500 text-white rounded-md text-lg font-semibold ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
          {isLoading ? 'Checking...' : 'Check Answers'}
        </button>
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

// Draggable List Item
const DraggableItem = ({ id, text, maxHeight }: { id: string; text: string; maxHeight: number }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minHeight: maxHeight,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-3 bg-gray-300 rounded-md cursor-pointer text-center flex items-center justify-center definition-item"
      style={style}>
      {text}
    </div>
  );
};

export default MatchingQuestion;
