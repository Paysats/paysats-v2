import { Routes, Route } from "react-router-dom";
import { Homepage } from "../pages/landing/home";
import NotFound from "../pages/NotFound";
import { ElectricityBills } from "@/pages/app/ElectricityBills";
import { FlightBookings } from "@/pages/app/FlightBookings";
import { CableTVSubscriptions } from "@/pages/app/CableTVSubscriptions";
import { HotelBookings } from "@/pages/app/HotelBookings";
import DataWithPaymentFlow from "@/pages/app/DataPayment";
import { AirtimePayment } from "@/pages/app/AirtimePayment";
import { Support } from "@/pages/app/Support";

export function MarketingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
            <Route path="/support" element={<Support />} />
      {/* TODO: remove and leave strictly in app routes when moving to prod */}
      <Route path="/airtime" element={<AirtimePayment />} />
      <Route path="/data" element={<DataWithPaymentFlow />} />
      <Route path="/electricity" element={<ElectricityBills />} />
      <Route path="/flights" element={<FlightBookings />} />
      <Route path="/cable-tv" element={<CableTVSubscriptions />} />
      <Route path="/hotels" element={<HotelBookings />} />
      {/*  */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
