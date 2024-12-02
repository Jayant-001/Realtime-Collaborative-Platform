import { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";

const ActivityMonitorLog = () => {
    const { activities } = useSocket();
    // const [logs, setLogs] = useState<IActivityLog[]>([
    //     {
    //         socketId: "s12345",
    //         username: "Jane Smith",
    //         activityType: "in",
    //         timestamp: new Date("2024-12-02T14:24:30.763Z"),
    //     },
    //     {
    //         socketId: "s67890",
    //         username: "David Miller",
    //         activityType: "out",
    //         timestamp: new Date("2024-12-02T13:12:17.493Z"),
    //     },
    //     {
    //         socketId: "s23456",
    //         username: "Bob Brown",
    //         activityType: "in",
    //         timestamp: new Date("2024-12-02T14:02:35.679Z"),
    //     },
    //     {
    //         socketId: "s98765",
    //         username: "Sophia Martinez",
    //         activityType: "out",
    //         timestamp: new Date("2024-12-02T14:18:49.417Z"),
    //     },
    //     {
    //         socketId: "s11223",
    //         username: "Charlie Davis",
    //         activityType: "in",
    //         timestamp: new Date("2024-12-02T13:45:20.150Z"),
    //     },
    //     {
    //         socketId: "s44556",
    //         username: "Emma Wilson",
    //         activityType: "in",
    //         timestamp: new Date("2024-12-02T14:10:01.524Z"),
    //     },
    //     {
    //         socketId: "s78901",
    //         username: "Oliver Taylor",
    //         activityType: "out",
    //         timestamp: new Date("2024-12-02T13:52:44.612Z"),
    //     },
    //     {
    //         socketId: "s34567",
    //         username: "James Anderson",
    //         activityType: "in",
    //         timestamp: new Date("2024-12-02T14:30:12.900Z"),
    //     },
    //     {
    //         socketId: "s98765",
    //         username: "Alice Johnson",
    //         activityType: "out",
    //         timestamp: new Date("2024-12-02T13:40:30.403Z"),
    //     },
    //     {
    //         socketId: "s11234",
    //         username: "John Doe",
    //         activityType: "in",
    //         timestamp: new Date("2024-12-02T14:05:55.789Z"),
    //     },
    // ]);

    const activitiesEndRef = useRef<HTMLDivElement>(null);
    // Scroll to bottom when messages change
    useEffect(() => {
        activitiesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activities]);

    return (
        <div className="bg-gray-100 p-2 sm:p-4">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Activity Log
                </h2>
                <div className="space-y-4">
                    {activities.map((log, index) => (
                        <div
                            key={index}
                            className={`p-4 border rounded-lg ${
                                log.activityType === "came online"
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">
                                    {log.username}
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-2">
                                {log.username} has {log.activityType}.
                            </p>
                        </div>
                    ))}
                    <div ref={activitiesEndRef} />
                </div>
            </div>
        </div>
    );
};

export default ActivityMonitorLog;
