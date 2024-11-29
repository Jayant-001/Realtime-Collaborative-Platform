import React from "react";
import Split from "react-split";
import CodeEditor from "@/components/CodeEditor";

const CodeEditorSection = () => {
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
                        name=""
                        id=""
                        className="bg-gray-800  w-full h-full  outline-none p-2 overflow-auto text-nowrap"
                    ></textarea>
                </div>
                <div className="text-nowrap overflow-auto p-2 border-t bg-gray-800 ">
                    {/* <p className="text-nowrap"> */}
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Expedita veritatis a officia error deleniti quae dolore
                    dolorum, tempore, laborum odit fugiat eligendi dicta,
                    tenetur quam nam aut labore sit nemo. sd f ewsafa asdf dsa
                    fsa fdsa fds asfd sad
                    {"\n"}
                    sadf jayant
                    {/* </p> */}
                </div>
            </Split>
        </Split>
    );
};

export default CodeEditorSection;
