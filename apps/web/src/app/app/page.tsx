"use client";
import React, { useEffect, useState } from "react";
import { Code, LoaderCircle, MessageSquareCode, Users } from "lucide-react";
import Split from "react-split";
import CodeEditorSection from "@/components/code-editor/CodeEditorSection";
import TextEditorSection from "@/components/text-editor/TextEditorSection";
import GroupChatSection from "@/components/group-chat/GroupChatSection";
import { useSocketStore } from "@/store/useSocketStore";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import ClientsList from "@/components/ClientsList";

// Type definitions for type safety and extensibility
interface User {
    id: string;
    username: string;
    avatar?: string;
}

interface TabConfig {
    id: string;
    label: string;
    icon?: React.ReactNode;
    component: React.ComponentType<{}>;
}

// Main Application Component
const RoomApplication: React.FC = () => {
    // Mock user data (in real app, this would come from backend/context)
    const users: User[] = [
        {
            id: "1",
            username: "John Doe",
            avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Emery",
        },
        {
            id: "2",
            username: "Jane Smith",
            avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton",
        },
        {
            id: "3",
            username: "Alice Johnson",
            avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton",
        },
        {
            id: "4",
            username: "Bob Williams",
            avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton",
        },
    ];

    const { joinRoom, socket, connectSocket } = useSocketStore.getState();

    const searchParams = useSearchParams();

    // Access the query parameters
    const room = searchParams.get("room"); // Gets the 'room' query param
    const username = searchParams.get("username"); // Gets the 'username' query param

    useEffect(() => {
       
        // if (room && username && socket) {
        //     console.log("initiating join room", room, username);
        //     joinRoom(room || "default", username || "default");
        // }
        // else {
        //     toast.error("Can't find room or username");
        // }
    }, [room, username, socket]);

    const [isLoading, setIsLoading] = useState(false);

    const { clients } = useSocketStore.getState();

    // Configurable Tabs (easily extensible)
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

    // State Management
    const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);

    // Find the active tab's component
    const ActiveTabComponent =
        tabs.find((tab) => tab.id === activeTabId)?.component ||
        CodeEditorSection;

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <Split
                    sizes={[12, 75]}
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
                            {/* <div className="space-y-2">
                                {users.map((user) => (
                                    <li
                                        key={user.id}
                                        className="flex justify-center items-center space-x-2 p-2 px-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-all"
                                    >
                                        <img
                                            src={user.avatar!}
                                            alt={user.username}
                                            // width={8}
                                            // height={8}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="text-base text-gray-800">
                                            {user.username.split(" ")[0]}
                                        </span>
                                    </li>
                                ))}
                            </div> */}
                            <ClientsList />
                        </div>
                        <div>
                            <div className="flex flex-col justify-center items-center gap-3">
                                <button className="text-white bg-black rounded-md active:opacity-70 px-2 py-2 w-full">
                                    Copy Room ID
                                </button>
                                <button className="text-white bg-red-700 rounded-md active:opacity-70 px-2 py-2 w-full">
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
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg">
                    <LoaderCircle className="w-20 h-20 spin-icon" />
                </div>
            )}
        </>
    );
};

export default RoomApplication;
