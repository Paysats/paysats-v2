import { Routes, Route } from "react-router-dom";
import { Homepage } from "../pages/landing/home";
import NotFound from "../pages/NotFound";
import { Airtime } from "@/pages/app/Airtime";
import { Data } from "@/pages/app/Data";
import { ElectricityBills } from "@/pages/app/ElectricityBills";
import { FlightBookings } from "@/pages/app/FlightBookings";
import { CableTVSubscriptions } from "@/pages/app/CableTVSubscriptions";
import HotelBookings from "@/pages/app/HotelBookings";

export function MarketingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      {/* TODO: remove and leave strictly in app routes when moving to prod */}
      <Route path="/airtime" element={<Airtime />} />
      <Route path="/data" element={<Data />} />
      <Route path="/electricity" element={<ElectricityBills />} />
      <Route path="/flights" element={<FlightBookings />} />
      <Route path="/cable-tv" element={<CableTVSubscriptions />} />
      <Route path="/hotels" element={<HotelBookings />} />
      {/*  */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
