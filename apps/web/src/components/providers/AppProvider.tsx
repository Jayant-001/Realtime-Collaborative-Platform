"use client";
import { useSocketStore } from "@/store/useSocketStore";
import React, { useEffect } from "react";

type Props = {
    children: React.ReactNode;
};

const AppProvider = ({ children }: Props) => {
    const { connectSocket, disconnectSocket } = useSocketStore.getState();

    useEffect(() => {
        connectSocket();

        return () => {
            disconnectSocket();
        };
    }, []);

    return <>{children}</>;
};

export default AppProvider;
