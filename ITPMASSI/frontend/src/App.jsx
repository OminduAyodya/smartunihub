import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { CanteenContext } from "./context/CanteenContext";
import TopNavigation from "./components/TopNavigation";
import Navbar from "./components/Navbar";
import Canteen from "./pages/Canteen";
import CanteenFoodStockPage from "./pages/CanteenFoodStockPage";
import CanteenOffersPage from "./pages/CanteenOffersPage";
import CanteenRequestsPage from "./pages/CanteenRequestsPage";
import AnohanaFoodStockPage from "./pages/canteens/anohana/AnohanaFoodStockPage";
import AnohanaOffersPage from "./pages/canteens/anohana/AnohanaOffersPage";
import AnohanaRequestsPage from "./pages/canteens/anohana/AnohanaRequestsPage";
import BasementFoodStockPage from "./pages/canteens/basement/BasementFoodStockPage";
import BasementOffersPage from "./pages/canteens/basement/BasementOffersPage";
import BasementRequestsPage from "./pages/canteens/basement/BasementRequestsPage";

const routeTitle = {
  "/canteen": "Canteen Home",
  "/canteen/food-stock": "Food & Stock",
  "/canteen/offers": "Offers & Promotions",
  "/canteen/requests": "Requests & Tracking",
  "/anohana/food-stock": "ANOHANA - Food & Stock",
  "/anohana/offers": "ANOHANA - Offers & Promotions",
  "/anohana/requests": "ANOHANA - Requests & Tracking",
  "/basement/food-stock": "Basement Canteen - Food & Stock",
  "/basement/offers": "Basement Canteen - Offers & Promotions",
  "/basement/requests": "Basement Canteen - Requests & Tracking",
};

const CANTEENS = [
  { id: 1, name: "ANOHANA", location: "Main Building" },
  { id: 2, name: "Basement Canteen", location: "Ground Floor" },
];

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored ? JSON.parse(stored) : { name: "Student", email: "student@smartunihub.com" };
    } catch {
      return { name: "Student", email: "student@smartunihub.com" };
    }
  });

  const [selectedCanteen, setSelectedCanteen] = useState(() => {
    try {
      const stored = localStorage.getItem("selectedCanteen");
      return stored ? JSON.parse(stored) : CANTEENS[0];
    } catch {
      return CANTEENS[0];
    }
  });
  
  const location = useLocation();

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  // Save selected canteen to localStorage
  useEffect(() => {
    localStorage.setItem("selectedCanteen", JSON.stringify(selectedCanteen));
  }, [selectedCanteen]);

  const title = routeTitle[location.pathname] || "Canteen Home";

  return (
    <CanteenContext.Provider value={{ selectedCanteen, setSelectedCanteen, canteens: CANTEENS }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <TopNavigation user={currentUser} selectedCanteen={selectedCanteen} />

        <div className="px-4 py-6 lg:px-6">
          <div className="mx-auto max-w-[1400px]">
            <Navbar user={currentUser} title={title} selectedCanteen={selectedCanteen} />

            <Routes>
              <Route path="/" element={<Navigate to="/canteen" replace />} />
              <Route path="/canteen" element={<Canteen />} />
              <Route path="/canteen/food-stock" element={<CanteenFoodStockPage />} />
              <Route path="/canteen/offers" element={<CanteenOffersPage />} />
              <Route path="/canteen/requests" element={<CanteenRequestsPage />} />
              <Route path="/anohana/food-stock" element={<AnohanaFoodStockPage />} />
              <Route path="/anohana/offers" element={<AnohanaOffersPage />} />
              <Route path="/anohana/requests" element={<AnohanaRequestsPage />} />
              <Route path="/basement/food-stock" element={<BasementFoodStockPage />} />
              <Route path="/basement/offers" element={<BasementOffersPage />} />
              <Route path="/basement/requests" element={<BasementRequestsPage />} />
              <Route path="*" element={<Navigate to="/canteen" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </CanteenContext.Provider>
  );
}

export default App;
