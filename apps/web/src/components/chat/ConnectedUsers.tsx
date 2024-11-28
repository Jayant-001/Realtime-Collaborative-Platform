import { useSocketStore } from "@/store/useSocketStore";
import React from "react";
import toast from "react-hot-toast";

const ConnectedUsers = () => {
    const clients = useSocketStore((state) => state.clients);
    const currentRoom = useSocketStore((state) => state.currentRoom);

    const copyToClipBoard = async () => {
        await navigator.clipboard.writeText(currentRoom as string);
        toast.success("Room ID copied to clipboard");
    };

    const onClickLeaveRoom = () => {
        
    }

    console.log(clients);
    return (
        <>
            {currentRoom ? (
                <div>
                    <div className="flex gap-2">
                        <h1>Room ID: {currentRoom}</h1>
                        <button
                            onClick={copyToClipBoard}
                            className="px-2 border"
                        >
                            Copy
                        </button>
                        <button onClick={onClickLeaveRoom} className="px-2 border">Leave Room</button>
                    </div>
                    <h3 className="font-bold text-lg">ConnectedUsers</h3>
                    <div className="space-x-2">
                        {clients.map((client) => (
                            <span key={client.socketId}>{client.username}</span>
                        ))}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default ConnectedUsers;
