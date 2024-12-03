import Split from "react-split";
import CodeEditor from "../CodeEditor";
import { useSocket } from "../../context/SocketContext";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";

// Define the type for the task result
interface TaskResult {
    status: "pending" | "success" | "error";
    result?: string;
    error?: string;
}

// Custom hook for handling long-running task polling
const useLongRunningTask = (maxPollingTime: number = 20 * 1000) => {
    // Default 20 seconds
    const [requestId, setRequestId] = useState<string | null>(null);
    const [result, setResult] = useState<TaskResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Submit the long-running task
    const submitTask = async (taskData: any) => {
        try {
            setIsLoading(true);
            setError(null);

            // Send task to backend
            const response = await axios.post(
                "http://localhost:4000/api/execute-code",
                taskData
            );

            // Store the request ID
            setRequestId(response.data.requestId);
        } catch (err) {
            setError("Failed to submit task");
            setIsLoading(false);
        }
    };

    // Poll for task result
    const pollTaskResult = useCallback(async () => {
        if (!requestId) return;

        try {
            const response = await axios.get(
                `http://localhost:4000/api/code-result/${requestId}`
            );
            const taskResult = response.data;
            
            // Update result based on status
            if (taskResult.status === "success") {
                setResult(taskResult.result);
                setIsLoading(false);
                return true; // Stop polling
            } else if (taskResult.status === "error") {
                setError(taskResult.result || "Task failed");
                setIsLoading(false);
                return true; // Stop polling
            }

            return false; // Continue polling
        } catch (err) {
            setError("Error fetching task result");
            setIsLoading(false);
            return true; // Stop polling on error
        }
    }, [requestId]);

    // Polling logic with timeout
    useEffect(() => {
        if (!requestId) return;

        const startTime = Date.now();
        let intervalId: NodeJS.Timeout;

        const pollWithTimeout = async () => {
            // Check if we've exceeded max polling time
            if (Date.now() - startTime > maxPollingTime) {
                setError("Polling timeout: Could not retrieve result");
                setIsLoading(false);
                clearInterval(intervalId);
                return;
            }

            const shouldStopPolling = await pollTaskResult();
            if (shouldStopPolling) {
                clearInterval(intervalId);
            }
        };

        // Initial poll
        pollWithTimeout();

        // Start interval polling
        intervalId = setInterval(pollWithTimeout, 2000); // Poll every 5 seconds

        // Cleanup
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [requestId, pollTaskResult, maxPollingTime]);

    // Reset the state
    const reset = () => {
        setRequestId(null);
        setResult(null);
        setIsLoading(false);
        setError(null);
    };

    return {
        submitTask,
        requestId,
        result,
        isLoading,
        error,
        reset,
    };
};

const CodeEditorSection = () => {
    const { input, setInput, syncInput } = useSocket();
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        syncInput(e.target.value);
    };

    const { submitTask, requestId, result, isLoading, error, reset } =
        useLongRunningTask();

    return (
        <Split direction="horizontal" className="flex flex-row w-full h-full">
            <CodeEditor submitTask={submitTask} isLoading={isLoading} />
            <Split
                className="flex flex-col  w-full border h-full  text-white"
                sizes={[40, 60]}
                direction="vertical"
            >
                <div className="border-b h-full">
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        className="bg-gray-800  w-full h-full  outline-none p-2 overflow-auto text-nowrap"
                    ></textarea>
                </div>
                <div
                    className={`text-nowrap overflow-auto p-2 border-t bg-gray-800 ${error && "text-red-600"}`}
                >
                    <pre>
                        {isLoading
                            ? "Loading..."
                            : `${error ? error : result ? result : ""}`}
                    </pre>
                </div>
            </Split>
        </Split>
    );
};

export default CodeEditorSection;
