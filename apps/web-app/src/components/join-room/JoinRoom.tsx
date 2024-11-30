import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";

const JoinRoom = () => {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const { joinRoom, currentRoom } = useSocket();

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();

        joinRoom(roomId, username);
    };

    useEffect(() => {
        if (currentRoom !== null) {
            navigate("/editor");
        }
    }, [currentRoom, navigate]);

    const handleCreateRoom = () => {
        setRoomId(uuidv4());
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                    Join to Collaborate
                </h1>
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="roomId"
                            className="block text-lg text-gray-700 mb-2"
                        >
                            Room ID
                        </label>
                        <input
                            type="text"
                            id="roomId"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter Room ID"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-lg text-gray-700 mb-2"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter Username"
                        />
                    </div>
                    <div className="flex justify-between space-x-4 mt-6">
                        <button
                            onClick={handleJoinRoom}
                            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            Join Room
                        </button>
                        <button
                            onClick={handleCreateRoom}
                            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Create Room
                        </button>
                    </div>
                </div>
            </div>

            {/* {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg">
                    <LoaderCircle className="w-20 h-20 spin-icon" />
                </div>
            )} */}
        </div>
    );
};

export default JoinRoom;
