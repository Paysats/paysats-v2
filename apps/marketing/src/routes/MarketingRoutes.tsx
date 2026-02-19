import { Routes, Route } from "react-router-dom";
import { Homepage } from "../pages/landing/home";
import NotFound from "../../../../packages/shared/src/components/NotFound";
import { Support } from "@/pages/app/Support";

import { TermsOfService } from "@/pages/legal/TermsOfService";
import { PrivacyPolicy } from "@/pages/legal/PrivacyPolicy";

export function MarketingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/support" element={<Support />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
