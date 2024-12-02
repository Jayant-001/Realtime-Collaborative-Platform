import React, { act, useCallback, useEffect, useState } from "react";
import { IActivityLog } from "./utils/types";
import { useSocket } from "./context/SocketContext";
import toast from "react-hot-toast";

type Props = {
    children: React.ReactNode;
};

const useWindowVisibility = () => {
    const [isWindowFocused, setIsWindowFocused] = useState(document.hasFocus());
    const [lastFocusChange, setLastFocusChange] = useState(Date.now());

    const handleFocusIn = useCallback(() => {
        setIsWindowFocused(true);
        setLastFocusChange(Date.now());
    }, []);

    const handleFocusOut = useCallback(() => {
        setIsWindowFocused(false);
        setLastFocusChange(Date.now());
    }, []);

    useEffect(() => {
        // Add event listeners for focus and blur
        window.addEventListener("focus", handleFocusIn);
        window.addEventListener("blur", handleFocusOut);

        // Additional check using document.hasFocus()
        const focusInterval = setInterval(() => {
            const currentlyFocused = document.hasFocus();
            if (currentlyFocused !== isWindowFocused) {
                setIsWindowFocused(currentlyFocused);
                setLastFocusChange(Date.now());
            }
        }, 500); // Check every 500ms

        return () => {
            // Cleanup
            window.removeEventListener("focus", handleFocusIn);
            window.removeEventListener("blur", handleFocusOut);
            clearInterval(focusInterval);
        };
    }, [handleFocusIn, handleFocusOut, isWindowFocused]);

    return {
        isWindowFocused,
        lastFocusChange,
    };
};

const ActivityMonitor = ({ children }: Props) => {
    const { isWindowFocused, lastFocusChange } = useWindowVisibility();
    const { currentRoom, socket, username, addActivity, sendActivity } =
        useSocket();

    useEffect(() => {
        if (currentRoom == null || socket == null || username == null) {
            // toast.error("Something went wrong");
            return;
        }

        const activity: IActivityLog = {
            roomId: currentRoom!,
            activityType: isWindowFocused ? "came online" : "went offline",
            socketId: socket!.id!,
            timestamp: new Date(),
            username: username!,
        };

        // addActivity(activity);
        sendActivity(activity);
        // console.log("Window focus: ", isWindowFocused);
        // console.log(
        //     "Last focus change: ",
        //     new Date(lastFocusChange).toLocaleString()
        // );
    }, [isWindowFocused, lastFocusChange]);

    return <>{children}</>;
};

export default ActivityMonitor;
