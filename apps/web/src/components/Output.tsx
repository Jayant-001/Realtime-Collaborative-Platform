"use client";

import { useSocketStore } from "@/store/useSocketStore";

export default function Output() {
    const socketState = useSocketStore();

    return (
        <div className=" rounded-lg shadow-sm p-4">
            <h3 className="font-medium mb-2">Output</h3>
            <pre className="p-2 rounded h-full overflow-auto font-mono text-sm border">
                {"Run your code to see the output..."}
            </pre>
        </div>
    );
}
