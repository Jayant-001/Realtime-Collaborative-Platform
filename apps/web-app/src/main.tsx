import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import EditorPage from "./pages/EditorPage.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <SocketProvider>
            <Toaster />
            <Routes>
                <Route path="/join-room" element={<App />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="*" element={<App />} />
            </Routes>
        </SocketProvider>
    </BrowserRouter>
);
