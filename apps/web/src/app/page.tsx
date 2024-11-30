// "use client";

import ConnectedUsers from "@/components/chat/ConnectedUsers";
import CodeEditor from "@/components/CodeEditor";
import JoinRoomForm from "@/components/join-room/JoinRoomForm";
import Output from "@/components/Output";
import ProblemDescription from "@/components/ProblemDescription";
import RoomForm from "@/components/RoomForm";
import TestCase from "@/components/TestCase";
import { useSocketStore } from "@/store/useSocketStore";
import { Problem } from "@/types/Problem";
import { useEffect } from "react";

// const sampleProblem: Problem = {
//     id: 1,
//     title: "Two Sum",
//     difficulty: "Easy",
//     description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
// You may assume that each input would have exactly one solution, and you may not use the same element twice.
// You can return the answer in any order.`,
//     examples: [
//         {
//             input: "nums = [2,7,11,15], target = 9",
//             output: "[0,1]",
//             explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
//         },
//     ],
//     constraints: [
//         "2 <= nums.length <= 104",
//         "-109 <= nums[i] <= 109",
//         "-109 <= target <= 109",
//     ],
//     starterCode: `function twoSum(nums, target) {
//     // Write your code here
// };`,
// };

export default function Home() {
    // const socketState = useSocketStore();
    // useEffect(() => {
    //     if (!socketState.socket) {
    //         socketState.connectSocket("http://localhost:4000");
    //     }
    //     return () => {
    //         socketState.disconnectSocket();
    //     };
    // }, []);

    return (
        // <div className="flex items-center justify-center">
        //     <main className="flex flex-col row-start-2 w-full items-center sm:items-start">
        //         <main className="min-h-screen w-full px-4">
        //             <div className=" mx-auto  py-8">
        //                 <div className="grid grid-cols-1 gap-8">
        //                     {/* <ProblemDescription problem={sampleProblem} /> */}
        //                     <div className="grid grid-cols-2 gap-4 h-[600px]">
        //                         <CodeEditor />
        //                         <div className="grid grid-rows-2 gap-4">
        //                             <TestCase />
        //                             <Output />
        //                         </div>
        //                     </div>
        //                     <RoomForm />
        //                     <ConnectedUsers />
        //                 </div>
        //             </div>
        //         </main>
        //     </main>
        // </div>

        <JoinRoomForm />
    );
}
