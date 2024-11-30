import { create } from "zustand";
import { STARTER_CODE } from "@/utils/constants";

interface IStore {
    code: string;
    input: string;
    selectedLanguage: string;
    isLoading: boolean;
    // Setters
    setCode: (code: string) => void;
    setInput: (input: string) => void;
    setSelectedLanguage: (language: string) => void;
    reset: () => void;
    setIsLoading: (value: boolean) => void;
}

export const useStore = create<IStore>((set) => ({
    code: STARTER_CODE.cpp,
    input: "",
    selectedLanguage: "cpp",
    userDetails: null,
    isLoading: false,

    // Setters
    setCode: (code) => set({ code }),
    setInput: (input) => set({ input }),
    setSelectedLanguage: (language) => {
        // Update the code with the selected language's template
        const newCode = STARTER_CODE[language];
        set({ selectedLanguage: language, code: newCode });
    },

    // Optional: Reset all state
    reset: () =>
        set({
            code: "",
            input: "",
            selectedLanguage: "javascript",
        }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
}));
