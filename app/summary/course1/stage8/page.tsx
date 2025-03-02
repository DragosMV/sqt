import TrueFalseQuestion from "@/components/TrueFalseQuestion";

export default function Stage8Page() {
  return (
    <div className="flex flex-col items-center bg-gray-50 space-y-8 p-8">
      <TrueFalseQuestion
        question="Unit tests should test multiple components at once."
        correctAnswer={false}
      />
      <TrueFalseQuestion
        question="Mocking is used to replace dependencies during testing."
        correctAnswer={true}
      />
    </div>
  );
}
