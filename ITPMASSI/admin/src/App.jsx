import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import AdminDashboard from "./pages/AdminDashboard";
import FoodManagementPage from "./pages/FoodManagementPage";
import OfferManagementPage from "./pages/OfferManagementPage";
import { CanteenProvider } from "./context/CanteenContext";

const routeTitle = {
  "/admin/dashboard": "Dashboard",
  "/admin/foods": "Food Management",
  "/admin/offers": "Offer Management",
};

function AppContent() {
  const [adminUser] = useState({
    name: "Admin User",
    email: "admin@smartunihub.com",
    role: "admin",
  });
  const location = useLocation();

  const title = routeTitle[location.pathname] || "Admin Portal";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex h-screen">
        <AdminSidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar user={adminUser} title={title} />

          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/foods" element={<FoodManagementPage />} />
                <Route path="/admin/offers" element={<OfferManagementPage />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <CanteenProvider>
      <AppContent />
    </CanteenProvider>
  );
}

export default App;
