"use client";

import { Editor } from "@monaco-editor/react";
import { LANGUAGE_VERSIONS } from "@/utils/constants";
import { useStore } from "../store/store";
import { useSocketStore } from "@/store/useSocketStore";
// import { useEffect, useRef } from "react";

export default function CodeEditor() {
    const languages = Object.entries(LANGUAGE_VERSIONS);

    const state = useStore((state) => state);
    const { syncCode } = useSocketStore.getState();

    // const editorRef = useRef(null);

    // useEffect(() => {
    //     if (editorRef.current) {
    //         editorRef.current.on("change", (instance: any, changes: any) => {
    //             console.log(instance, changes);
    //         });
    //     }
    // }, [editorRef, editorRef.current]);

    const handleCodeChange = (code: any) => {
        state.setCode(code as string);
        syncCode(code);
    };

    return (
        <div className=" rounded-lg shadow-sm overflow-hidden h-full">
            <div className="bg-gray-800 px-4 py-2 flex justify-between">
                <select
                    value={state.selectedLanguage}
                    className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                    onChange={(e) => state.setSelectedLanguage(e.target.value)}
                >
                    {languages.map(([lang, version]) => (
                        <option
                            key={lang}
                            className="w-full flex justify-between"
                            value={lang}
                        >
                            {lang}
                            &nbsp;
                            {/* <span className="text-sm text-gray-600"> */}(
                            {version}){/* </span> */}
                        </option>
                    ))}
                </select>
                <button className="px-2 h-full py-1 bg-orange-500 rounded-md text-white active:opacity-50">
                    RUN
                </button>
            </div>
            <Editor
                height={"100%"}
                language={state.selectedLanguage}
                defaultLanguage={state.selectedLanguage}
                defaultValue={state.code}
                value={state.code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
}
