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
import { IActivityLog, IMessage } from "../utils/types";
import { STARTER_CODE } from "../utils/constants";

interface IClient {
    socketId: string;
    username: string;
}

interface SocketContextType {
    socket: Socket | null;
    messages: IMessage[];
    currentRoom: string | null;
    users: IClient[];
    code: string;
    language: string;
    username: string | null;
    isConnected: boolean;
    text: string;
    input: string;
    output: string;
    activities: IActivityLog[];
    connectSocket: () => void;
    disconnectSocket: () => void;
    sendMessage: (message: IMessage) => void;
    joinRoom: (room: string, username: string) => void;
    addMessage: (message: IMessage) => void;
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
    setMessages: (messages: IMessage[]) => void;
    syncLanguage: (language: string) => void;
    syncInput: (input: string) => void;
    setActivities: (activity: IActivityLog[]) => void;
    addActivity: (activity: IActivityLog) => void;
    sendActivity: (activity: IActivityLog) => void;
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
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [users, setUsers] = useState<IClient[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [code, setCode] = useState<string>(STARTER_CODE.cpp);
    const [language, setLanguage] = useState<string>("cpp");
    const [username, setUsername] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [activities, setActivities] = useState<IActivityLog[]>([]);

    const codeRef = useRef(code); // Create a ref to store the latest code
    const textRef = useRef(text); // Create a ref to store the latest text

    // Update the ref value whenever the code state changes
    useEffect(() => {
        codeRef.current = code;
        textRef.current = text;
    }, [code, text]);

    const connectSocket = () => {
        const socket = io("http://localhost:4000", {
            // TODO: Update code to read URL from env
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

        socket.on(SocketActions.SEND_MESSAGE, (message) => {
            // console.log("RECEIVED message from socket: ", message);
            addMessage(message);
        });

        socket.on(SocketActions.ACTIVITY_CHANGE, (activity) => {
            addActivity(activity);
        });

        socket.on(
            SocketActions.SYNC_USER,
            ({ users, code, text, messages, input, language, activities }) => {
                setUsers(users);
                if (code != null) setCode(code);
                if (input != null) setInput(input);
                if (language != null) setLanguage(language);
                setText(text);
                setMessages(messages);
                setActivities(activities);
            }
        );

        socket.on(SocketActions.JOINED, ({ username }) => {
            toast.success(`${username} joined`);
            // socket.emit(SocketActions.SYNC_USER, {
            //     socketId,
            //     code: codeRef.current,
            //     text: textRef.current,
            // });
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

        // socket.on(SocketActions.SYNC_CODE, ({ code }) => {
        //     console.log("Received Code sync ", code);
        //     setCode(code);
        // });

        socket.on(SocketActions.TEXT_CHANGE, ({ text }) => {
            setText(text);
        });

        socket.on(SocketActions.LANGUAGE_CHANGE, ({ language }) => {
            setLanguage(language);
        });

        socket.on(SocketActions.INPUT_CHANGE, ({ input }) => {
            setInput(input);
        });

        socket.on(SocketActions.ROOM_USERS, ({ users }) => {
            // console.log("Users: ", users, code, text);
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

    const addMessage = (message: IMessage) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const addActivity = (activity: IActivityLog) => {
        setActivities((prevActivities) => [...prevActivities, activity]);
    };

    const sendMessage = (message: IMessage) => {
        if (socket && currentRoom) {
            socket.emit(SocketActions.SEND_MESSAGE, message);
        } else {
            toast.error("Socket not connected");
        }
    };

    const sendActivity = (activity: IActivityLog) => {
        if (socket && currentRoom) {
            socket.emit(SocketActions.ACTIVITY_CHANGE, activity);
        } else {
            toast.error("Socket not connected");
        }
    };

    const joinRoom = (room: string, username: string) => {
        setUsername(username);
        setCurrentRoom(room);
        localStorage.setItem("joined__roomId", room); // TODO remove harcoded key
        localStorage.setItem("joined__username", username); // TODO remove harcoded key
        if (socket) {
            socket.emit(SocketActions.JOIN, { roomId: room, username });
        } else {
            toast.error("Socket not connected");
        }
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

    const syncLanguage = (language: string) => {
        if (socket && socket.connected && currentRoom) {
            socket.emit(SocketActions.LANGUAGE_CHANGE, {
                roomId: currentRoom,
                language,
            });
        } else {
            toast.error("Socket not connected");
        }
    };

    const syncInput = (input: string) => {
        if (socket && socket.connected && currentRoom) {
            socket.emit(SocketActions.INPUT_CHANGE, {
                roomId: currentRoom,
                input,
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
        activities,
        connectSocket,
        disconnectSocket,
        sendMessage,
        joinRoom,
        addMessage,
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
        setMessages,
        syncLanguage,
        syncInput,
        setActivities,
        addActivity,
        sendActivity,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
