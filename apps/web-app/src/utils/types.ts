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
