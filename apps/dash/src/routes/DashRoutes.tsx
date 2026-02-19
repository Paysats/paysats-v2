import { Routes, Route, Navigate } from "react-router-dom";
import DashLayout from "../layouts/DashLayout";
import DashDashboard from "../pages/DashDashboard";
import LedgerList from "../pages/LedgerList";
import LedgerDetails from "../pages/LedgerDetails";
import ControlCenter from "../pages/ControlCenter";
import LoginPage from "../pages/LoginPage";

export function DashRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<DashLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashDashboard />} />
                <Route path="/ledger" element={<LedgerList />} />
                <Route path="/ledger/:reference" element={<LedgerDetails />} />
                <Route path="/controls" element={<ControlCenter />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
