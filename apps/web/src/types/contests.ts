// Contest interface to define the structure of a contest
export interface Contest {
    id: number;
    title: string;
    startDateTime: string;
    endDateTime: string;
    minParticipants: number;
    maxParticipants: number;
    numberOfQuestions: number;
    author: string;
    status: "upcoming" | "live" | "past";
    difficulty: string;
    prize?: number;
}

// Contest Details Interface
export interface ContestDetails {
    id: number;
    title: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    registrationDeadline: string;
    status: "upcoming" | "live" | "past";
    difficulty: string;
    prize: number;
    totalQuestions: number;
    registeredUsers: number;
    maxParticipants: number;
    organization: string;
    tags: string[];
    topRankedUsers: TopUser[];
    rules: string[];
    prizes: PrizeStructure[];
}

export interface TopUser {
    rank: number;
    username: string;
    score: number;
    country: string;
}

export interface PrizeStructure {
    rank: number;
    prize: number;
}
