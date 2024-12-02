import ReactQuill from "react-quill-new";

import "react-quill-new/dist/quill.snow.css";
import { useSocket } from "../../context/SocketContext";
// import "react-quill-new/dist/quill.bubble.css";

const TextEditorSection = () => {
    const { text, setText, syncText } = useSocket();

    const handleOnTextChange = (value: string) => {
        setText(value);
        syncText(value);
    };

    return (
        <div className="h-full">
            <ReactQuill
                placeholder="Start typing here..."
                theme="snow"
                value={text}
                onChange={handleOnTextChange}
                className="h-[92%]"
            />
        </div>
    );
};

export default TextEditorSection;
