import { Contest } from "@/types/contests";
import { formatDateTime } from "@/utils/methods";
import { Clock, FileText, User, Users } from "lucide-react";
import Link from "next/link";

// ContestCard Component
const ContestCard: React.FC<{ contest: Contest }> = ({ contest }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                    {contest.title}
                </h3>
                <span
                    className={`
            px-3 py-1 rounded-full text-sm font-semibold
            ${
                contest.status === "upcoming"
                    ? "bg-blue-100 text-blue-800"
                    : contest.status === "live"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
            }
          `}
                >
                    {contest.status.charAt(0).toUpperCase() +
                        contest.status.slice(1)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center text-gray-600">
                    <Clock className="mr-2 w-5 h-5" />
                    <span>Start: {formatDateTime(contest.startDateTime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Clock className="mr-2 w-5 h-5" />
                    <span>End: {formatDateTime(contest.endDateTime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Users className="mr-2 w-5 h-5" />
                    <span>
                        Participants: {contest.minParticipants}-
                        {contest.maxParticipants}
                    </span>
                </div>
                <div className="flex items-center text-gray-600">
                    <FileText className="mr-2 w-5 h-5" />
                    <span>Questions: {contest.numberOfQuestions}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <User className="mr-2 w-5 h-5" />
                    <span>Author: {contest.author}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <span className="font-semibold text-purple-700">
                        Prize: ${contest.prize?.toLocaleString() || "N/A"}
                    </span>
                </div>
            </div>

            <Link href={`contests/${contest.id}`}>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors">
                    View Contest Details
                </button>
            </Link>
        </div>
    );
};

export default ContestCard;
