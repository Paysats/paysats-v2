import { Routes, Route } from "react-router-dom";
import DataWithPaymentFlow from "@/pages/DataPayment";
import { ElectricityBills } from "@/pages/ElectricityBills";
import { FlightBookings } from "@/pages/FlightBookings";
import { CableTVSubscriptions } from "@/pages/CableTVSubscriptions";
import { HotelBookings } from "@/pages/HotelBookings";
import NotFound from "../../../../packages/shared/src/components/NotFound"
import { AirtimePayment } from "@/pages/AirtimePayment";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AirtimePayment />} />
            <Route path="/airtime" element={<AirtimePayment />} />
            <Route path="/data" element={<DataWithPaymentFlow />} />
            <Route path="/electricity" element={<ElectricityBills />} />
            <Route path="/flights" element={<FlightBookings />} />
            <Route path="/cable-tv" element={<CableTVSubscriptions />} />
            <Route path="/hotels" element={<HotelBookings />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
