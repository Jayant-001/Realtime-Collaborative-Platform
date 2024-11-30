// context/SocketContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
} from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { SocketActions } from "../utils/SocketActions";
import toast from "react-hot-toast";

interface IClient {
    socketId: string;
    username: string;
}

interface SocketContextType {
    socket: Socket | null;
    messages: string[];
    currentRoom: string | null;
    users: IClient[];
    code: string;
    language: string;
    username: string | null;
    isConnected: boolean;
    text: string;
    input: string;
    output: string;
    connectSocket: () => void;
    disconnectSocket: () => void;
    sendMessage: (message: string) => void;
    joinRoom: (room: string, username: string) => void;
    addMessage: (message: string) => void;
    setCode: (code: string) => void;
    setLanguage: (lang: string) => void;
    syncCode: (code: string) => void;
    setUsername: (username: string) => void;
    setIsConnected: (value: boolean) => void;
    leaveRoom: () => void; // Add leaveRoom function to context
    setText: (text: string) => void;
    syncText: (text: string) => void;
    setInput: (text: string) => void;
    setOutput: (text: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [users, setUsers] = useState<IClient[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [code, setCode] = useState<string>("");
    const [language, setLanguage] = useState<string>("");
    const [username, setUsername] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");

    const codeRef = useRef(code); // Create a ref to store the latest code
    const textRef = useRef(text); // Create a ref to store the latest text

    // Update the ref value whenever the code state changes
    useEffect(() => {
        codeRef.current = code;
        textRef.current = text;
    }, [code, text]);

    const connectSocket = () => {
        const socket = io("http://localhost:4000", {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            toast.success("Socket connected");
            setSocket(socket);
            setIsConnected(true);
            console.log(socket);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        });

        socket.on("connect_error", (err) => {
            console.log(err);
        });

        socket.on("connect_failed", (err) => {
            console.log(err);
        });

        socket.on("chat_message", (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on(SocketActions.JOINED, ({ username, socketId }) => {
            toast.success(`${username} joined`);
            socket.emit(SocketActions.SYNC_USER, {
                socketId,
                code: codeRef.current,
                text: textRef.current,
            });
        });

        socket.on(SocketActions.DISCONNECTED, ({ socketId, username }) => {
            toast.success(`${username} disconnected`);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.socketId !== socketId)
            );
        });

        socket.on(SocketActions.LEAVED, ({ socketId, username }) => {
            toast.success(`${username} left`);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.socketId !== socketId)
            );
        });

        socket.on(SocketActions.CODE_CHANGE, ({ code }) => {
            if (code != null) {
                setCode(code);
            }
        });

        socket.on(SocketActions.SYNC_CODE, ({ code }) => {
            console.log("Received Code sync ", code);
            setCode(code);
        });

        socket.on(SocketActions.TEXT_CHANGE, ({ text }) => {
            setText(text);
        });

        socket.on(SocketActions.ROOM_USERS, ({ users }) => {
            console.log("Users: ", users);
            setUsers(users);
        });
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.off(SocketActions.JOINED);
            socket.off(SocketActions.DISCONNECTED);
            socket.off(SocketActions.CODE_CHANGE);
            socket.off(SocketActions.SYNC_CODE);
            socket.disconnect();
        }
        setSocket(null);
        setCurrentRoom(null);
    };

    const sendMessage = (message: string) => {
        if (socket && currentRoom) {
            socket.emit("chat_message", {
                room: currentRoom,
                message,
            });
            setMessages((prevMessages) => [...prevMessages, message]);
        }
    };

    const joinRoom = (room: string, username: string) => {
        if (socket) {
            socket.emit(SocketActions.JOIN, { roomId: room, username });
        }
        setCurrentRoom(room);
    };

    const syncCode = (code: string) => {
        if (socket && socket.connected && currentRoom) {
            socket.emit(SocketActions.CODE_CHANGE, {
                roomId: currentRoom,
                code,
            });
        } else {
            toast.error("Socket not connected");
        }
    };

    const syncText = (text: string) => {
        if (socket && socket.connected && currentRoom) {
            socket.emit(SocketActions.TEXT_CHANGE, {
                roomId: currentRoom,
                text,
            });
        } else {
            toast.error("Socket not connected");
        }
    };

    // New function to handle leaving the room
    const leaveRoom = () => {
        if (socket && currentRoom) {
            socket.emit(SocketActions.LEAVED, { roomId: currentRoom });
            toast.success("You left the room");
            setMessages([]); // Clear chat messages
            setUsers([]); // Clear the list of users
            setCode(""); // Clear the code editor
            setCurrentRoom(null); // Reset the current room
            socket.off(SocketActions.JOINED);
            socket.off(SocketActions.DISCONNECTED);
            socket.off(SocketActions.CODE_CHANGE);
            socket.off(SocketActions.SYNC_CODE);
        }
    };

    useEffect(() => {
        // Initialize socket connection on mount
        connectSocket();

        return () => {
            // Cleanup socket on unmount
            disconnectSocket();
        };
    }, []);

    const value = {
        socket,
        messages,
        currentRoom,
        users,
        code,
        language,
        username,
        isConnected,
        text,
        input,
        output,
        connectSocket,
        disconnectSocket,
        sendMessage,
        joinRoom,
        addMessage: (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        },
        setCode,
        setLanguage,
        setUsername,
        setIsConnected,
        syncCode,
        leaveRoom,
        setText,
        syncText,
        setInput,
        setOutput,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
