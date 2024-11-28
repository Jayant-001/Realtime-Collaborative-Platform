// lib/useSocketStore.ts
import { create } from "zustand";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { SocketActions } from "@/utils/socketActions";
import { IClient } from "@/types/socket";
import toast from "react-hot-toast";
import { useStore } from "./store";

// Define the store's state and actions
interface SocketState {
    socket: Socket | null;
    messages: string[];
    currentRoom: string | null;
    clients: IClient[];
    code: string;
    language: string;
    username: string | null;
    connectSocket: (url: string) => void;
    disconnectSocket: () => void;
    sendMessage: (message: string) => void;
    joinRoom: (room: string, username: string) => void;
    addMessage: (message: string) => void;
    setCode: (code: string) => void;
    setLanguage: (lang: string) => void;
    syncCode: (code: string) => void;
    setUsername: (username: string) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
    socket: null,
    messages: [],
    currentRoom: null,
    clients: [],
    code: "",
    language: "",
    username: null,

    // Initialize socket connection
    connectSocket: (url: string) => {
        const socket = io(url, {
            forceNew: true,
            timeout: 10000,
            transports: ["websocket"],
        });
        set({ socket });

        socket.on("connect_error", (err) => {
            alert(err.message);
            console.log(err);
        });

        socket.on("connect_failed", (err) => {
            alert(err.message);
            console.log(err);
        });

        // Listen for incoming messages
        socket.on("chat_message", (message: string) => {
            set((state) => ({ messages: [...state.messages, message] }));
        });

        // Listen for room join success
        socket.on(SocketActions.JOINED, ({ clients, username, socketId }) => {
            const currentSocketId = useSocketStore.getState().socket?.id;

            console.log({ clients, username, socketId });
            set({ clients: clients });
            if (currentSocketId != socketId) {
                // set({ currentRoom: room });
                toast.success(`${username} joined`);

                const code = useStore.getState().code;
                socket.emit(SocketActions.SYNC_CODE, { socketId, code });
            }
        });

        // Listen event: when any user disconnected from the room
        socket.on(SocketActions.DISCONNECTED, ({ socketId, username }) => {
            toast(`${username} left`, { icon: "😐" });
            set((state) => ({
                clients: state.clients.filter(
                    (client) => client.socketId !== socketId
                ),
            }));
        });

        socket.on(SocketActions.CODE_CHANGE, ({ code }) => {
            if (code != null) {
                const setCode = useStore.getState().setCode;
                setCode(code);
            }
        });

        socket.on(SocketActions.SYNC_CODE, ({ code }) => {
            const setCode = useStore.getState().setCode;
            setCode(code);
        });
    },

    // Cleanup and disconnect socket
    disconnectSocket: () => {
        set((state) => {
            if (state.socket) {
                state.socket.off(SocketActions.JOINED);
                state.socket.off(SocketActions.DISCONNECTED);
                state.socket.off(SocketActions.CODE_CHANGE);
                state.socket.off(SocketActions.SYNC_CODE);
                state.socket.disconnect();
            }
            return { socket: null, currentRoom: null };
        });
    },

    // Send a chat message
    sendMessage: (message: string) => {
        set((state) => {
            if (state.socket && state.currentRoom) {
                state.socket.emit("chat_message", {
                    room: state.currentRoom,
                    message,
                });
            }
            return { messages: [...state.messages, message] };
        });
    },

    syncCode: (code: string) => {
        const { socket, currentRoom } = useSocketStore.getState();

        if (socket && socket.connected) {
            socket.emit(SocketActions.CODE_CHANGE, {
                roomId: currentRoom,
                code,
            });
        } else {
            toast.error("Socket not connected");
        }
    },

    // Join a specific room
    joinRoom: (room: string, username: string) => {
        set((state) => {
            if (state.socket) {
                state.socket.emit(SocketActions.JOIN, {
                    roomId: room,
                    username,
                });
            }
            return { currentRoom: room };
        });
    },

    // Add a message directly
    addMessage: (message: string) => {
        set((state) => ({
            messages: [...state.messages, message],
        }));
    },

    setCode: (code: string) => {
        set({ code });
    },

    setLanguage: (language: string) => {
        set({ language });
    },

    setUsername: (username: string) => {
        set({ username });
    },
}));
