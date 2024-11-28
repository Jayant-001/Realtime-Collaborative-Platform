"use client";

import { useStore } from "@/store/store";
import axios from "axios";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function TestCase() {
    const editorState = useStore((state) => state);

    const onRun = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:4000/api/send`,
                {
                    requestId: uuidv4(),
                    content: {
                        code: editorState.code,
                        language: editorState.selectedLanguage,
                        input: editorState.input,
                    },
                }
            );

            console.log(response);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <div className="rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Input</h3>
                <button
                    onClick={onRun}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition-colors"
                >
                    Run
                </button>
            </div>
            <textarea
                value={editorState.input}
                onChange={(e) => editorState.setInput(e.target.value)}
                className="w-full h-full p-2 border rounded resize-none font-mono text-sm bg-transparent"
                placeholder="Enter your test case here..."
            />
        </div>
    );
}
