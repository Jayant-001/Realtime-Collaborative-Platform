"use client";
import React, { useState } from "react";
import {
    Code,
    MessageCircle,
    MessageSquareCode,
    Settings,
    Users,
} from "lucide-react";
import Split from "react-split";
import CodeEditorSection from "@/components/code-editor/CodeEditorSection";
import TextEditorSection from "@/components/text-editor/TextEditorSection";
import GroupChatSection from "@/components/group-chat/GroupChatSection";
// import CodeEditor from "@/components/CodeEditor";

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

// Sample Tab Components (easily extendable)
const ChatTab: React.FC = () => (
    <div className=" bg-white h-full">
        {/* <h2 className="text-xl font-bold mb-4">Group Chat</h2> */}
        {/* <div className="space-y-4 h-full"> */}
        {/* <CodeEditor /> */}
        {/* </div> */}
    </div>
);

const MembersTab: React.FC = () => (
    <div className="p-4 bg-white h-full">
        <h2 className="text-xl font-bold mb-4">Room Members</h2>
        <div className="space-y-2">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                <span>John Doe</span>
            </div>
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                <span>Jane Smith</span>
            </div>
        </div>
    </div>
);

const SettingsTab: React.FC = () => (
    <div className="p-4 bg-white h-full w-full">
        <h2 className="text-xl font-bold mb-4">Room Settings</h2>
        <div className="space-y-4">
            <div>
                <label className="block mb-2">Room Name</label>
                <input
                    type="text"
                    placeholder="Enter room name"
                    className="w-full p-2 border rounded"
                />
            </div>
        </div>
    </div>
);

// Main Application Component
const RoomApplication: React.FC = () => {
    // Mock user data (in real app, this would come from backend/context)
    const users: User[] = [
        { id: "1", username: "John Doe" },
        { id: "2", username: "Jane Smith" },
        { id: "3", username: "Alice Johnson" },
        { id: "4", username: "Bob Williams" },
    ];

    // Configurable Tabs (easily extensible)
    const tabs: TabConfig[] = [
        {
            id: "chat",
            label: "Code Editor",
            icon: <Code size={16} />,
            component: CodeEditorSection,
        },
        {
            id: "members",
            label: "Text Editor",
            icon: <Users size={16} />,
            component: TextEditorSection,
        },
        {
            id: "settings",
            label: "Group Chat",
            icon: <MessageSquareCode size={16} />,
            component: GroupChatSection,
        },
    ];

    // State Management
    const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);

    // Find the active tab's component
    const ActiveTabComponent =
        tabs.find((tab) => tab.id === activeTabId)?.component || ChatTab;

    return (
        <div className="flex h-screen overflow-hidden">
            <Split
                sizes={[10, 75]}
                direction="horizontal"
                className="flex flex-row w-full"
                cursor="col-resize"
                gutterSize={10}
                // minSize={100}
            >
                {/* Fixed Left Sidebar - User List */}
                <div className="w-[100px] bg-gray-100 p-2 overflow-y-auto border-r">
                    <h3 className="text-sm font-bold mb-2 text-center">
                        Users
                    </h3>
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="text-xs py-1 text-center truncate hover:bg-gray-200 rounded"
                        >
                            {user.username}
                        </div>
                    ))}
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
    );
};

export default RoomApplication;
