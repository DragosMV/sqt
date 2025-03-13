import MatchingQuestion from "@/components/MatchingQuestion";

const matchingPairs1 = [
  { id: "1", term: "Mocking", definition: "Replaces dependencies in tests" },
  { id: "2", term: "Assertion", definition: "Checks expected vs actual result" },
  { id: "3", term: "Test Fixture", definition: "Sets up test data/environment" },
];

export default function Stage6Page() {
  return (
    <div>
      <MatchingQuestion question="Match the definition to the correct term" pairs={matchingPairs1} stageNumber={6} />
    </div>
  );
}
