import ContestCard from "@/components/contests/ContestCard";
import { Contest } from "@/types/contests";



// Sample contest data
const contestData: Contest[] = [
    {
        id: 1,
        title: "Spring Coding Challenge",
        startDateTime: "2024-06-15T10:00:00Z",
        endDateTime: "2024-06-20T18:00:00Z",
        minParticipants: 10,
        maxParticipants: 100,
        numberOfQuestions: 5,
        author: "CodeMaster",
        status: "upcoming",
        difficulty: "Intermediate",
        prize: 1000,
    },
    {
        id: 2,
        title: "Spring Coding Challenge",
        startDateTime: "2024-06-15T10:00:00Z",
        endDateTime: "2024-06-20T18:00:00Z",
        minParticipants: 10,
        maxParticipants: 100,
        numberOfQuestions: 5,
        author: "CodeMaster",
        status: "upcoming",
        difficulty: "Intermediate",
        prize: 1000,
    },
    {
        id: 3,
        title: "AI Ethics Hackathon",
        startDateTime: "2024-05-10T14:00:00Z",
        endDateTime: "2024-05-12T20:00:00Z",
        minParticipants: 5,
        maxParticipants: 50,
        numberOfQuestions: 3,
        author: "EthicalTech",
        status: "live",
        difficulty: "Advanced",
        prize: 2500,
    },
    {
        id: 4,
        title: "AI Ethics Hackathon",
        startDateTime: "2024-05-10T14:00:00Z",
        endDateTime: "2024-05-12T20:00:00Z",
        minParticipants: 5,
        maxParticipants: 50,
        numberOfQuestions: 3,
        author: "EthicalTech",
        status: "live",
        difficulty: "Advanced",
        prize: 2500,
    },
    {
        id: 5,
        title: "Winter Data Science Tournament",
        startDateTime: "2024-02-01T09:00:00Z",
        endDateTime: "2024-02-10T17:00:00Z",
        minParticipants: 15,
        maxParticipants: 75,
        numberOfQuestions: 7,
        author: "DataGurus",
        status: "past",
        difficulty: "Expert",
        prize: 5000,
    },
    {
        id: 6,
        title: "Winter Data Science Tournament",
        startDateTime: "2024-02-01T09:00:00Z",
        endDateTime: "2024-02-10T17:00:00Z",
        minParticipants: 15,
        maxParticipants: 75,
        numberOfQuestions: 7,
        author: "DataGurus",
        status: "past",
        difficulty: "Expert",
        prize: 5000,
    },
];

const ContestsPage = () => {
    const upcomingContests = contestData.filter(
        (contest) => contest.status === "upcoming"
    );
    const liveContests = contestData.filter(
        (contest) => contest.status === "live"
    );
    const pastContests = contestData.filter(
        (contest) => contest.status === "past"
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 ">
                Coding Contests
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Upcoming Contests */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                        Upcoming Contests
                    </h2>
                    {upcomingContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                    ))}
                </div>

                {/* Live Contests */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-green-600">
                        Live Contests
                    </h2>
                    {liveContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                    ))}
                </div>

                {/* Past Contests */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-600">
                        Past Contests
                    </h2>
                    {pastContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContestsPage;
