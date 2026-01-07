import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import DataWithPaymentFlow from "@/pages/app/DataPayment";
import { ElectricityBills } from "@/pages/app/ElectricityBills";
import { FlightBookings } from "@/pages/app/FlightBookings";
import { CableTVSubscriptions } from "@/pages/app/CableTVSubscriptions";
import { HotelBookings } from "@/pages/app/HotelBookings";


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/data" element={<DataWithPaymentFlow />} />
            <Route path="/electricity" element={<ElectricityBills />} />
            <Route path="/flights" element={<FlightBookings />} />
            <Route path="/cable-tv" element={<CableTVSubscriptions />} />
            <Route path="/hotels" element={<HotelBookings />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
