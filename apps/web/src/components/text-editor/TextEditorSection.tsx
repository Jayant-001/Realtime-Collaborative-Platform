import React, { useEffect, useMemo, useState } from "react";
// import ReactQuill from "react-quill-new";
import dynamic from "next/dynamic";

import "react-quill-new/dist/quill.snow.css";
// import "react-quill-new/dist/quill.bubble.css";

const TextEditorSection = () => {
    const [value, setValue] = useState("");
    const ReactQuill = useMemo(
        () => dynamic(() => import("react-quill-new"), { ssr: false }),
        []
    );

    useEffect(() => {
        console.log(value);
    }, [value]);

    return (
        <div className="h-full">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                className="h-full"
            />
        </div>
    );
};

export default TextEditorSection;
