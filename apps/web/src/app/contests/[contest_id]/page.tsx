import CountdownTimer from "@/components/contests/CountdownTimer";
import { ContestDetails } from "@/types/contests";
import { formatDateTime } from "@/utils/methods";
import {
    AlertTriangle,
    Clock,
    Code,
    FileText,
    Star,
    Trophy,
    UserCheck,
    Users,
} from "lucide-react";
import React from "react";

// Sample Contest Details
const contestDetails: ContestDetails = {
    id: 1,
    title: "Global AI and Machine Learning Challenge",
    description:
        "A comprehensive contest to test and showcase advanced AI and machine learning skills. Participants will solve complex real-world problems using cutting-edge techniques.",
    startDateTime: "2024-06-15T10:00:00Z",
    endDateTime: "2024-06-20T18:00:00Z",
    registrationDeadline: "2024-06-14T23:59:59Z",
    status: "upcoming",
    difficulty: "Advanced",
    prize: 10000,
    totalQuestions: 5,
    registeredUsers: 87,
    maxParticipants: 100,
    organization: "Tech Innovators Foundation",
    tags: ["AI", "Machine Learning", "Data Science"],
    topRankedUsers: [
        { rank: 1, username: "CodeNinja", score: 945, country: "India" },
        { rank: 2, username: "AIWizard", score: 932, country: "USA" },
        { rank: 3, username: "DataPro", score: 918, country: "Germany" },
        { rank: 4, username: "MLExpert", score: 905, country: "Canada" },
        { rank: 5, username: "AlgoMaster", score: 890, country: "UK" },
    ],
    rules: [
        "Participants must use only Python or R",
        "No external libraries except standard ML libraries",
        "Plagiarism will result in immediate disqualification",
        "Submissions must include complete code and documentation",
    ],
    prizes: [
        { rank: 1, prize: 10000 },
        { rank: 2, prize: 5000 },
        { rank: 3, prize: 2500 },
    ],
};

// Contest Details Page
const ContestDetailsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="bg-slate-600 shadow-slate-600 shadow-md rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {contestDetails.title}
                    </h1>
                    <span
                        className={`
              px-4 py-2 rounded-full font-semibold
              ${
                  contestDetails.status === "upcoming"
                      ? "bg-blue-100 text-blue-800"
                      : contestDetails.status === "live"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
              }
            `}
                    >
                        {contestDetails.status.charAt(0).toUpperCase() +
                            contestDetails.status.slice(1)}
                    </span>
                </div>

                {/* Contest Meta Information */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                        <Clock className="mr-2 text-indigo-600" />
                        <span>
                            Starts:{" "}
                            {formatDateTime(contestDetails.startDateTime)}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Users className="mr-2 text-indigo-600" />
                        <span>
                            Registered: {contestDetails.registeredUsers}/
                            {contestDetails.maxParticipants}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Trophy className="mr-2 text-indigo-600" />
                        <span>
                            Prize: ${contestDetails.prize.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Countdown Timer */}
                {contestDetails.status === "live" && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-center mb-4">
                            Time Remaining
                        </h3>
                        <CountdownTimer endTime={contestDetails.endDateTime} />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition flex items-center">
                        <Code className="mr-2" /> Solve Problems
                    </button>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition flex items-center">
                        <Trophy className="mr-2" /> Full Rankings
                    </button>
                </div>
            </div>

            {/* Detailed Information Sections */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Description and Details */}
                <div className="md:col-span-2 bg-slate-600 shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Contest Description
                    </h2>
                    <p className="text-gray-700 mb-4">
                        {contestDetails.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">
                                Contest Details
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <FileText className="mr-2 text-indigo-600" />
                                    Questions: {contestDetails.totalQuestions}
                                </li>
                                <li className="flex items-center">
                                    <Star className="mr-2 text-indigo-600" />
                                    Difficulty: {contestDetails.difficulty}
                                </li>
                                <li className="flex items-center">
                                    <UserCheck className="mr-2 text-indigo-600" />
                                    Organization: {contestDetails.organization}
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {contestDetails.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Ranked Users */}
                <div className="bg-slate-600 shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <Trophy className="mr-2 text-yellow-500" /> Top
                        Performers
                    </h2>
                    <div className="space-y-3">
                        {contestDetails.topRankedUsers.map((user) => (
                            <div
                                key={user.rank}
                                className="flex justify-between items-center"
                            >
                                <div className="flex items-center">
                                    <span className="mr-3 font-semibold text-gray-600">
                                        #{user.rank}
                                    </span>
                                    <span>{user.username}</span>
                                </div>
                                <span className="text-indigo-600 font-bold">
                                    {user.score}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rules and Prizes */}
                <div className="md:col-span-2 bg-slate-600 shadow-md rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                Contest Rules
                            </h3>
                            <ul className="space-y-2">
                                {contestDetails.rules.map((rule, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <AlertTriangle className="mr-2 text-red-500 flex-shrink-0 mt-1" />
                                        <span>{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                Prize Structure
                            </h3>
                            <div className="space-y-2">
                                {contestDetails.prizes.map((prizeInfo) => (
                                    <div
                                        key={prizeInfo.rank}
                                        className="flex justify-between items-center"
                                    >
                                        <span>Rank #{prizeInfo.rank}</span>
                                        <span className="font-bold text-green-600">
                                            ${prizeInfo.prize.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestDetailsPage;
