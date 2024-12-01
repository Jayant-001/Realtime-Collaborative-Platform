import { useState } from "react";
import { TabConfig } from "../utils/types";
import { Code, MessageSquareCode, Users } from "lucide-react";
import CodeEditorSection from "../components/code-editor-section/CodeEditor-section";
import TextEditorSection from "../components/text-editor-section/TextEditorSection";
import GroupChatSection from "../components/group-chat-section/GroupChatSection";
import ClientsList from "../components/ClientsList";
import Split from "react-split";
import toast from "react-hot-toast";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router";

const EditorPage = () => {
    const tabs: TabConfig[] = [
        {
            id: "code-editor",
            label: "Code Editor",
            icon: <Code size={16} />,
            component: CodeEditorSection,
        },
        {
            id: "text-editor",
            label: "Text Editor",
            icon: <Users size={16} />,
            component: TextEditorSection,
        },
        {
            id: "group-chat",
            label: "Group Chat",
            icon: <MessageSquareCode size={16} />,
            component: GroupChatSection,
        },
    ];

    const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);

    // Find the active tab's component
    const ActiveTabComponent =
        tabs.find((tab) => tab.id === activeTabId)?.component ||
        CodeEditorSection;

    const { currentRoom, leaveRoom } = useSocket();
    const navigate = useNavigate();

    const handleCopyRoomID = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await navigator.clipboard.writeText(currentRoom as string);
        toast.success("Room ID copied to clipboard");
    };

    const handleLeaveRoom = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        leaveRoom();
        navigate("/");
    };

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <Split
                    sizes={[13, 75]}
                    direction="horizontal"
                    className="flex flex-row w-full"
                    cursor="col-resize"
                    gutterSize={10}
                    // minSize={100}
                >
                    {/* Fixed Left Sidebar - User List */}
                    <div className=" bg-gray-100 p-2 overflow-y-auto border-r flex flex-col justify-between">
                        <div className="">
                            <h3 className="text-lg font-bold mb-2 text-center">
                                Live Users
                            </h3>
                            <ClientsList />
                        </div>
                        <div>
                            <div className="flex flex-col justify-center items-center gap-3">
                                <button
                                    onClick={handleCopyRoomID}
                                    className="text-white bg-black rounded-md active:opacity-70 px-2 py-2 w-full"
                                >
                                    Copy Room ID
                                </button>
                                <button
                                    onClick={handleLeaveRoom}
                                    className="text-white bg-red-700 rounded-md active:opacity-70 px-2 py-2 w-full"
                                >
                                    Leave
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Right Content Area */}
                    <div className="flex-1 flex flex-col w-full">
                        {/* Tab Navigation */}
                        <div className="flex border-b">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTabId(tab.id)}
                                    className={`
                        px-4 py-2 flex items-center gap-2 
                        ${
                            activeTabId === tab.id
                                ? "bg-blue-100 border-b-2 border-blue-500 text-blue-600"
                                : "hover:bg-gray-100"
                        }
                        transition-all duration-200
                        `}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Tab Content */}
                        <div className="flex-1 overflow-auto">
                            <ActiveTabComponent />
                        </div>
                    </div>
                </Split>
            </div>
            {/* {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg">
                    <LoaderCircle className="w-20 h-20 spin-icon" />
                </div>
            )} */}
        </>
    );
};

export default EditorPage;
