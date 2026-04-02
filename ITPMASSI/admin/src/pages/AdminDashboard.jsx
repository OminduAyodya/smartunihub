import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBox,
  FiGift,
  FiTrendingUp,
  FiShoppingCart,
} from "react-icons/fi";
import AdminCard from "../components/AdminCard";
import { API_BASE_URL } from "../config/api";
import { useCanteen } from "../context/CanteenContext";

const AdminDashboard = () => {
  const { selectedCanteen, setSelectedCanteen, canteens } = useCanteen();
  const [stats, setStats] = useState({
    totalFoods: 0,
    inStockFoods: 0,
    outOfStockFoods: 0,
    activeOffers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [foodsRes, offersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/foods?canteen=${selectedCanteen}`),
          fetch(`${API_BASE_URL}/api/offers?canteen=${selectedCanteen}`),
        ]);

        const foods = await foodsRes.json();
        const offers = await offersRes.json();

        const foodsArray = Array.isArray(foods) ? foods : [];
        const offersArray = Array.isArray(offers) ? offers : [];

        const inStock = foodsArray.filter((f) => f.inStock).length;
        const outOfStock = foodsArray.filter((f) => !f.inStock).length;
        const activeOffers = offersArray.filter((o) => o.isActive).length;

        setStats({
          totalFoods: foodsArray.length,
          inStockFoods: inStock,
          outOfStockFoods: outOfStock,
          activeOffers: activeOffers,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setStats({
          totalFoods: 0,
          inStockFoods: 0,
          outOfStockFoods: 0,
          activeOffers: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCanteen]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="panel-glass p-6 border border-slate-700/50">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">Canteen Admin Dashboard</h1>
            <p className="text-slate-300 mt-2">
              Manage your canteen's food inventory and special offers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-slate-300 font-medium">Select Canteen:</label>
            <select
              value={selectedCanteen}
              onChange={(e) => setSelectedCanteen(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
            >
              {canteens.map((canteen) => (
                <option key={canteen.id} value={canteen.id}>
                  {canteen.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCard
          title="Total Foods"
          value={stats.totalFoods}
          subtitle="Food items"
          icon={<FiBox />}
          color="blue"
        />
        <AdminCard
          title="In Stock"
          value={stats.inStockFoods}
          subtitle="Available items"
          icon={<FiTrendingUp />}
          color="green"
        />
        <AdminCard
          title="Out of Stock"
          value={stats.outOfStockFoods}
          subtitle="Unavailable items"
          icon={<FiShoppingCart />}
          color="red"
        />
        <AdminCard
          title="Active Offers"
          value={stats.activeOffers}
          subtitle="Running promotions"
          icon={<FiGift />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/foods"
              className="block px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-center font-medium"
            >
              Manage Foods
            </a>
            <a
              href="/admin/offers"
              className="block px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-center font-medium"
            >
              Manage Offers
            </a>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Backend API</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                ✓ Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Database</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                ✓ Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
