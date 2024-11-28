"use client";
import { Problem } from "@/types/Problem";

interface Props {
    problem: Problem;
}

export default function ProblemDescription({ problem }: Props) {
    return (
        <div className=" rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{problem.title}</h1>
                <span
                    className={`px-3 py-1 rounded-full text-sm ${
                        problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : problem.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                    }`}
                >
                    {problem.difficulty}
                </span>
            </div>
            <div className="prose max-w-none">
                <p className="whitespace-pre-line">{problem.description}</p>

                <h3 className="text-lg font-semibold mt-4">Examples:</h3>
                {problem.examples.map((example, index) => (
                    <div key={index} className="mt-2">
                        <p className="font-medium">Example {index + 1}:</p>
                        <pre className=" p-2 rounded mt-1">
                            <p>Input: {example.input}</p>
                            <p>Output: {example.output}</p>
                            {example.explanation && (
                                <p>Explanation: {example.explanation}</p>
                            )}
                        </pre>
                    </div>
                ))}

                <h3 className="text-lg font-semibold mt-4">Constraints:</h3>
                <ul className="list-disc pl-5">
                    {problem.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
