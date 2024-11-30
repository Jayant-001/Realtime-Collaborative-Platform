import Split from "react-split";
import CodeEditor from "../CodeEditor";
import { useSocket } from "../../context/SocketContext";
import { ChangeEvent } from "react";

const CodeEditorSection = () => {
    const { input, setInput, output } = useSocket();
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    return (
        <Split direction="horizontal" className="flex flex-row w-full h-full">
            <CodeEditor />
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
                <div className="text-nowrap overflow-auto p-2 border-t bg-gray-800 ">
                    {output}
                </div>
            </Split>
        </Split>
    );
};

export default CodeEditorSection;
