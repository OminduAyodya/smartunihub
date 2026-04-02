import { useEffect, useMemo, useState } from "react";
import { FiLoader, FiRefreshCw, FiSearch, FiBox } from "react-icons/fi";
import RequestFoodModal from "../components/canteen/RequestFoodModal";
import { createFoodRequest, getFoods, getUsers, mockUsers } from "../services/api";
import { useCanteen } from "../context/CanteenContext";

const CanteenFoodStockPage = () => {
  const { selectedCanteen } = useCanteen();
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [selectedBuyFood, setSelectedBuyFood] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
      const matchesAvailability = availableOnly ? food.inStock : true;
      return matchesSearch && matchesAvailability;
    });
  }, [foods, search, availableOnly]);

  const currentUser = useMemo(
    () => users.find((user) => String(user._id) === String(currentUserId)) || null,
    [users, currentUserId]
  );

  const helperOptions = useMemo(
    () => users.filter((user) => user.role !== "admin" && String(user._id) !== String(currentUser?._id)),
    [users, currentUser]
  );

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.setTimeout(() => setAlert({ type: "", message: "" }), 2800);
  };

  const loadFoods = async (silent = false) => {
    if (!silent) {
      setLoadingFoods(true);
    }

    try {
      const response = await getFoods();
      setFoods(response.data || []);
    } catch {
      setFoods([]);
    } finally {
      if (!silent) {
        setLoadingFoods(false);
      }
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersResponse = await getUsers();
        const apiUsers = (usersResponse.data || []).filter((user) => user.role !== "admin");
        if (apiUsers.length) {
          setUsers(apiUsers);
          setCurrentUserId(apiUsers[0]._id);
        } else {
          setUsers(mockUsers);
          setCurrentUserId(mockUsers[0]._id);
        }
      } catch {
        setUsers(mockUsers);
        setCurrentUserId(mockUsers[0]._id);
      }
    };

    loadUsers();
  }, []);

  const handleSendRequest = async ({ requesterId, helperId, quantity, serviceCharge, message, itNumber, phoneNumber }) => {
    if (!selectedBuyFood || !currentUser?._id) return;

    setSubmitting(true);
    try {
      await createFoodRequest({
        foodId: selectedBuyFood._id,
        requesterId: requesterId || currentUser._id,
        helperId: helperId || undefined,
        quantity,
        serviceCharge,
        message,
        itNumber,
        phoneNumber,
      });
      setSelectedBuyFood(null);
      showAlert("success", "Buy help request sent. A nearby friend can accept it.");
    } catch {
      showAlert("error", "Failed to send buy request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inStockCount = foods.filter((f) => f.inStock).length;

  return (
    <div className="space-y-6">
      {alert.message ? (
        <div
          className={`rounded-2xl px-6 py-4 font-semibold shadow-soft ${
            alert.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {alert.message}
        </div>
      ) : null}

      {/* Header Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Items</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">{foods.length}</p>
            </div>
            <div className="rounded-xl bg-emerald-100 p-3 text-2xl text-emerald-600">
              <FiBox />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 font-semibold">In Stock</p>
              <p className="mt-1 text-3xl font-extrabold text-emerald-900">{inStockCount}</p>
            </div>
            <div className="rounded-xl bg-emerald-500 p-3 text-2xl text-white">
              ✓
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-700 font-semibold">Out of Stock</p>
              <p className="mt-1 text-3xl font-extrabold text-rose-900">{foods.length - inStockCount}</p>
            </div>
            <div className="rounded-xl bg-rose-500 p-3 text-2xl text-white">
              ✕
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <FiSearch className="text-slate-400" />
          <h3 className="text-lg font-bold text-slate-900">Search & Filter</h3>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search food items..."
              className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex gap-2">
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
                className="w-4 h-4"
              />
              Available only
            </label>

            <button
              type="button"
              onClick={() => loadFoods()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        {loadingFoods ? (
          <div className="flex items-center justify-center gap-2 p-12 text-slate-600">
            <FiLoader className="animate-spin" /> Loading food items...
          </div>
        ) : filteredFoods.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredFoods.map((food) => (
              <div
                key={food._id}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition hover:border-emerald-300"
              >
                <div className="relative overflow-hidden bg-slate-100 h-40">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                    onError={(event) => {
                      event.currentTarget.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80";
                    }}
                  />
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition">{food.name}</h4>
                  <p className="mt-2 text-lg font-extrabold text-emerald-600">LKR {Number(food.price).toFixed(2)}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold transition ${
                        food.inStock
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {food.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedBuyFood(food)}
                      disabled={!food.inStock}
                      className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                        food.inStock
                          ? "bg-slate-900 text-white hover:bg-slate-700"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FiBox className="text-4xl text-slate-300 mb-3" />
            <p className="text-slate-600 font-semibold">No food items found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <RequestFoodModal
        isOpen={Boolean(selectedBuyFood)}
        selectedFood={selectedBuyFood}
        requesters={users}
        defaultRequesterId={currentUserId}
        currentUserDetails={currentUser}
        friends={helperOptions}
        onClose={() => setSelectedBuyFood(null)}
        onSubmit={handleSendRequest}
      />

      {submitting ? (
        <div className="fixed bottom-6 right-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-lg flex items-center gap-2">
          <FiLoader className="animate-spin" /> Sending buy request...
        </div>
      ) : null}
    </div>
  );
};

export default CanteenFoodStockPage;
