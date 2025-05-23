import { useState, useEffect } from "react";

export default function InterviewResult() {
  const [scores, setScores] = useState<{ score: number; tips: string[] }[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    // Fetch scores from the server or local storage
    const fetchScores = async () => {
      const response = await fetch("/api/interview/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Fetch scores" }),
      });
      const data = await response.json();
      setScores(data.scores);
      setOverallScore(data.overallScore);
    };

    fetchScores();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Interview Results</h1>
      <div className="mb-4">
        <h2 className="text-xl">Overall Score: {overallScore}</h2>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Per-Question Scores:</h3>
        {scores.map((item, index) => (
          <div key={index} className="mt-2">
            <p>Question {index + 1}: {item.score}</p>
            <p>Tips: {item.tips.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 