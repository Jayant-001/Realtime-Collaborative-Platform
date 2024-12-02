"use client";

import { Editor } from "@monaco-editor/react";
import { LANGUAGE_VERSIONS, STARTER_CODE } from "../utils/constants";
import { useSocket } from "../context/SocketContext";
import { useEffect, useRef } from "react";

export default function CodeEditor() {
    const languages = Object.entries(LANGUAGE_VERSIONS);

    const { language, setLanguage, code, setCode, syncCode, syncLanguage } =
        useSocket();

    // const editorRef = useRef(null);

    // useEffect(() => {
    //     if (editorRef.current) {
    //         editorRef.current.on("change", (instance: any, changes: any) => {
    //             console.log(instance, changes);
    //         });
    //     }
    // }, [editorRef, editorRef.current]);

    const handleCodeChange = (code: any) => {
        setCode(code);
        syncCode(code);
    };

    // useEffect(() => {
    //     console.log(code);
    // }, []);

    const onSelectLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const choosedLanguage = event.target.value;
        if (choosedLanguage != language) {
            const choosedCode = STARTER_CODE[choosedLanguage];

            setLanguage(choosedLanguage);
            setCode(choosedCode);
            syncCode(choosedCode);
            syncLanguage(choosedLanguage);
        }

        // setLanguage(language as Language);
        // setValue(STARTER_CODE[language as Language]);
    };

    return (
        <div className=" rounded-lg shadow-sm overflow-hidden h-full">
            <div className="bg-gray-800 px-4 py-2 flex justify-between">
                <select
                    value={language}
                    className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                    onChange={onSelectLanguage}
                >
                    {languages.map(([lang, version]) => (
                        <option
                            key={lang}
                            className="w-full flex justify-between"
                            value={lang}
                        >
                            {lang}
                            &nbsp;
                            {/* <span className="text-sm text-gray-600"> */}
                            {version}
                            {/* </span> */}
                        </option>
                    ))}
                </select>
                <button className="px-2 h-full py-1 bg-orange-500 rounded-md text-white active:opacity-50">
                    RUN
                </button>
            </div>
            <Editor
                height={"100%"}
                language={language}
                defaultLanguage={language}
                defaultValue={code}
                value={code}
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
