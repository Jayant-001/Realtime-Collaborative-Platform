import { v4 as uuidv4 } from "uuid";

import React, { useState } from "react";
import { useSocketStore } from "@/store/useSocketStore";

const RoomForm = () => {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const socketState = useSocketStore();

    const handleRoomJoin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        socketState.joinRoom(roomId, username);
    };

    const handleCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setRoomId(uuidv4());
    };

    return (
        <div className="w-full bg-transparent flex justify-between">
            <div className="flex justify-evenly flex-1">
                <input
                    onChange={(e) => setRoomId(e.target.value)}
                    type="text"
                    placeholder="Room ID"
                    value={roomId}
                    className="bg-transparent h-full w-full px-1 border border-l"
                />
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    value={username}
                    placeholder="Username"
                    className="bg-transparent h-full px-1"
                />
            </div>
            <div className="space-x-5">
                <button
                    onClick={handleRoomJoin}
                    className="p-2 border active:bg-slate-500"
                >
                    Join
                </button>
                <button
                    onClick={handleCreateRoom}
                    className="p-2 border active:bg-slate-500"
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default RoomForm;
