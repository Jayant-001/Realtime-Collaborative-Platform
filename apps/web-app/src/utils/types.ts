export interface IClient {
    socketId: string;
    username: string;
}

export interface TabConfig {
    id: string;
    label: string;
    icon?: React.ReactNode;
    component: React.ComponentType<{}>;
}

export interface IMessage {
    id: string;
    senderId: string;
    roomId: string;
    timestamp: Date;
    content: string;
    username: string;
}

export interface IActivityLog {
    socketId: string;
    username: string;
    activityType: "came online" | "went offline" | "joined" | "leaved";
    timestamp: Date;
    roomId: string;
}
