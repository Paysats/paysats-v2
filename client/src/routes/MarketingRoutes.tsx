import { Routes, Route } from "react-router-dom";
import { Homepage } from "../pages/landing/home";
import NotFound from "../pages/NotFound";
import { Airtime } from "@/pages/app/Airtime";
import { Data } from "@/pages/app/Data";

export function MarketingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
{/* TODO: remove and leave strictly in app routes when moving to prod */}
      <Route path="/airtime" element={<Airtime />} />
      <Route path="/data" element={<Data />} />
      {/*  */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
