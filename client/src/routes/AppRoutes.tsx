import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { Airtime } from "@/pages/app/Airtime";
import { Data } from "@/pages/app/Data";


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/airtime" element={<Airtime />} />
            <Route path="/data" element={<Data />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
