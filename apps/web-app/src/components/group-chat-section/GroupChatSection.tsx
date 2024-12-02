import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Users, Settings } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { IMessage } from "../../utils/types";
import { v4 as uuidV4 } from "uuid";

const GroupChatSection = () => {
    const { messages, socket, username, currentRoom, sendMessage } =
        useSocket();
    const [newMessage, setNewMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessageHandler = () => {
        if (newMessage.trim() === "") return;

        const message: IMessage = {
            id: uuidV4(),
            senderId: socket!.id!,
            username: username!,
            content: newMessage,
            timestamp: new Date(),
            roomId: currentRoom!,
        };

        // setMessages([...messages, message]);
        sendMessage(message);
        setNewMessage("");
    };

    // Format timestamp
    const formatTimestamp = (timestamp: Date) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }).format(date);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Chat Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.username == username ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`
                max-w-[70%] p-2 rounded-lg shadow-sm
                ${
                    msg.username == username
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200"
                }
              `}
                        >
                            {/* Message Header */}
                            <div className="flex justify-between mb-1 space-x-1 items-center">
                                <span className="font-semibold text-sm">
                                    {msg.username == username
                                        ? "You"
                                        : msg.username}
                                </span>
                                <span className="text-xs opacity-70">
                                    {formatTimestamp(msg.timestamp)}
                                    {/* {new Date(msg.timestamp).toString()} */}
                                </span>
                            </div>

                            {/* Message Content */}
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div className="p-4 bg-white border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && sendMessageHandler()
                        }
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                    <button
                        onClick={sendMessageHandler}
                        className="
              bg-blue-500 text-white p-2 rounded-lg 
              hover:bg-blue-600 transition-colors
              flex items-center justify-center
            "
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupChatSection;
