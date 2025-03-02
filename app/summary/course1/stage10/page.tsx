"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const API_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || "";

const Compiler = () => {
  const [code, setCode] = useState("# Write your Python code here");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRunCode = async () => {
    setLoading(true);
    setOutput("");
  
    try {
      //Submit code for execution
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
          stdin: "", // input 
        }),
      });
  
      const { token } = await submissionResponse.json();
  
      //Poll for result
      let result;
      while (true) {
        const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
          method: "GET",
          headers: { "X-RapidAPI-Key": API_KEY },
        });
  
        result = await resultResponse.json();
  
        if (result.status.id >= 3) break; // >= 3 means execution is complete
      }
  
      setOutput(result.stdout || result.stderr || "No output");
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Failed to run code.");
    }
  
    setLoading(false);
  }  

  return (
<div className="flex">
  {/* Problem Statement Box */}
  <div className="w-[45%] p-6 bg-gray-50 border rounded-lg shadow-md mr-6">
    <h2 className="text-xl font-semibold mb-2">Problem Statement</h2>
    <p>Write a Python function to return the square of a number.</p>
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