"use client";
import React, { useEffect, useState } from "react";

const CountdownTimer: React.FC<{ endTime: string }> = ({ endTime }) => {
    const calculateTimeLeft = () => {
        const difference = new Date(endTime).getTime() - new Date().getTime();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = Object.entries(timeLeft).map(
        ([interval, value]) => (
            <div key={interval} className="flex flex-col items-center mx-2">
                <span className="text-2xl font-bold text-indigo-600">
                    {value as string}
                </span>
                <span className="text-xs ">{interval}</span>
            </div>
        )
    );

    return (
        <div className="flex justify-center items-center space-x-4">
            {timerComponents.length ? (
                timerComponents
            ) : (
                <span>Contest Ended</span>
            )}
        </div>
    );
};

export default CountdownTimer;
