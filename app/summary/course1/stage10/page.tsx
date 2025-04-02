"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { handleCorrectAnswer } from "@/utils/answerHandlers";
import { useAuth } from "@/context/AuthContext";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || "";
const initialCode = `import unittest

def square(number):
  try:
    # Convert input to float to handle numeric strings
    num = float(number)
    return num ** 2
  except ValueError:
    return "Invalid input! Please provide a numeric value."


class TestAddFunction(unittest.TestCase):
  def test_square_integer(self):
    self.assertEqual(square(x), y)
  
  def test_square_float(self):
  
  def test_square_zeros(self):

  def test_square_invalid(self):

unittest.main()`;

const Compiler = () => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const authContext = useAuth();
  const { currentUser } = authContext || {};
  const stageNumber = 10;

  const handleRunCode = async () => {
    setLoading(true);
    setOutput("");
  
    try {
      // Submit code for execution
      const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
        method: "POST",
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: 71, // Python 3
          stdin: "", // No input needed for unittests
        }),
      });
  
      const { token } = await submissionResponse.json();
  
      // Poll for result
      let result;
      while (true) {
        const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
          method: "GET",
          headers: { "X-RapidAPI-Key": API_KEY },
        });
  
        result = await resultResponse.json();
  
        if (result.status.id >= 3) break; // Execution is complete
      }
  
      // Check if all tests pass
      const testPassed = result.stderr && result.stderr.includes("OK");
      console.log(result.stderr)

      // Extract the number of tests ran
      const ranTestsMatch = result.stderr.match(/Ran (\d+) test/);
      const ranTests = ranTestsMatch ? parseInt(ranTestsMatch[1], 10) : 0;

      // Check for failure keywords
      const testFailed = result.stderr.includes("FAILED");
      
      if (ranTests >= 4 && testPassed && !testFailed) {
        setOutput(`✅ ${ranTests} tests passed! You earned 10 points and can now complete the course!`);
        // Award points and update stage
        await handleCorrectAnswer(currentUser, stageNumber);
      } else {
        setOutput(`❌ ${ranTests} tests ran. ${testFailed ? "Some tests failed." : "Not enough tests written." 
        } You need at least 4 correct tests to earn points.`
        );
      }
  
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Failed to run code.");
    }
  
    setLoading(false);
  };

  return (
    <div className="flex">
      {/* Problem Statement Box */}
      <div className="w-[45%] p-6 bg-gray-50 border rounded-lg shadow-md mr-6">
        <h2 className="text-xl font-semibold mb-2">Problem Statement</h2>
        <p>
        <strong>Task:</strong> You are given the function <code>square</code>, which should calculate the square of the input number.
        </p>
        <p>
          <strong>Instructions: </strong>  
          Write a unit test for this function, checking multiple types of inputs, similar to the example in the previous lesson.  
        </p>
        <ul className="list-disc list-inside">
          <p>There is already some code ready for you in the editor.</p>
          <p><strong>Reminders:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>All test functions should have the <code>test_</code> prefix.</li>
            <li>Use <code>assertEqual</code> to compare expected and actual outputs.</li>
            <li>Ensure you handle multiple input types:
              <ul className="list-disc list-inside ml-4">
                <li><strong>Typical cases</strong> (e.g., integers, floats).</li>
                <li><strong>Edge cases</strong> (e.g., zero, negative numbers, large values).</li>
                <li><strong>Invalid inputs</strong> (e.g., strings, special characters).</li>
              </ul>
            </li>
          </ul>
        </ul>
      </div>

      {/* Code Editor + Output Box */}
      <div className="w-[55%] flex flex-col space-y-4">
        <div className="p-4 bg-gray-50 border rounded-lg shadow-md">
          <Editor
            height="45vh"
            defaultLanguage="python"
            value={code}
            onChange={(value) => setCode(value || "")}
          />
        </div>
        <button
          onClick={handleRunCode}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md">
          {loading ? "Running..." : "Run Code"}
        </button>

        {/* Output Box */}
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold">Output:</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
