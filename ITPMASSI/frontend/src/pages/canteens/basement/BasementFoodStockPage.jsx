import { useEffect, useMemo, useState } from "react";
import { FiLoader, FiRefreshCw, FiSearch, FiBox, FiStar, FiTag, FiTrendingUp, FiImage } from "react-icons/fi";
import RequestFoodModal from "../../../components/canteen/RequestFoodModal";
import { createFoodRequest, getFoods, getUsers, mockUsers } from "../../../services/api";

const BASEMENT_DEFAULT_FOODS = [
  {
    _id: "basement-local-1",
    name: "Noodles",
    price: 280,
    inStock: true,
    image: "/images/canteen/noodles.jpg",
  },
  {
    _id: "basement-local-2",
    name: "Rice and Curry 2",
    price: 450,
    inStock: true,
    image: "/images/canteen/rice and curry2.jpg",
  },
  {
    _id: "basement-local-3",
    name: "Cupcake",
    price: 150,
    inStock: true,
    image: "/images/canteen/cupcake.jpg",
  },
  {
    _id: "basement-local-4",
    name: "Snack",
    price: 200,
    inStock: true,
    image: "/images/canteen/roll.jpg",
  },
  {
    _id: "basement-local-5",
    name: "Aloe Drink",
    price: 320,
    inStock: true,
    image: "/images/canteen/aloe.jpg",
  },
  {
    _id: "basement-local-6",
    name: "Milo",
    price: 250,
    inStock: true,
    image: "/images/canteen/milo.jpg",
  },
  {
    _id: "basement-local-7",
    name: "Egg Roll",
    price: 180,
    inStock: true,
    image: "/images/canteen/egg roll.jpg",
  },
];

const BasementFoodStockPage = () => {
  const LOCAL_REQUESTS_KEY = "basement-local-requests";
  const ACTIVE_USER_KEY = "basement-active-user-id";
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedBuyFood, setSelectedBuyFood] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Food categories with emojis
  const foodCategories = {
    rice: { emoji: "🍚", label: "Rice Dishes" },
    curry: { emoji: "🍛", label: "Curries" },
    bread: { emoji: "🥖", label: "Bread" },
    juice: { emoji: "🥤", label: "Beverages" },
    dessert: { emoji: "🍰", label: "Desserts" },
    salad: { emoji: "🥗", label: "Salads" },
    seafood: { emoji: "🦐", label: "Seafood" },
    meat: { emoji: "🍗", label: "Meat Dishes" },
  };

  // Mock function to assign category and rating
  const enrichFoodData = (food) => {
    const categories = Object.keys(foodCategories);
    const idx = food._id ? food._id.charCodeAt(0) % categories.length : 0;
    return {
      ...food,
      category: foodCategories[categories[idx]],
      rating: (Math.random() * 2 + 3.5).toFixed(1), // 3.5-5.5
      reviews: Math.floor(Math.random() * 150) + 20, // 20-170
      quantity: food.inStock ? Math.floor(Math.random() * 50) + 10 : 0, // 10-60 or 0
    };
  };

  const filteredFoods = useMemo(() => {
    return foods
      .map(enrichFoodData)
      .filter((food) => {
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
      const serverFoods = response?.data || [];
      // Always include 4 local Basement cards, then append API data.
      setFoods([...BASEMENT_DEFAULT_FOODS, ...serverFoods]);
    } catch {
      setFoods(BASEMENT_DEFAULT_FOODS);
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
          const storedUserId = window.localStorage.getItem(ACTIVE_USER_KEY);
          const resolvedUserId = apiUsers.some((user) => String(user._id) === String(storedUserId))
            ? storedUserId
            : apiUsers[0]._id;
          setCurrentUserId(resolvedUserId);
        } else {
          setUsers(mockUsers);
          const storedUserId = window.localStorage.getItem(ACTIVE_USER_KEY);
          const resolvedUserId = mockUsers.some((user) => String(user._id) === String(storedUserId))
            ? storedUserId
            : mockUsers[0]._id;
          setCurrentUserId(resolvedUserId);
        }
      } catch {
        setUsers(mockUsers);
        const storedUserId = window.localStorage.getItem(ACTIVE_USER_KEY);
        const resolvedUserId = mockUsers.some((user) => String(user._id) === String(storedUserId))
          ? storedUserId
          : mockUsers[0]._id;
        setCurrentUserId(resolvedUserId);
      }
    };

    loadUsers();
  }, []);

  const handleSendRequest = async ({ requesterId, helperId, quantity, serviceCharge, message, itNumber, phoneNumber }) => {
    if (!selectedBuyFood || !currentUser?._id) return;

    const resolvedRequesterId = requesterId || currentUser._id;
    window.localStorage.setItem(ACTIVE_USER_KEY, String(resolvedRequesterId));

    const saveLocalRequest = () => {
      const localRequest = {
        id: `local-${Date.now()}`,
        _id: `local-${Date.now()}`,
        requesterId: resolvedRequesterId,
        foodName: selectedBuyFood.name,
        itemPrice: Number(selectedBuyFood.price || 0),
        userName: users.find((user) => String(user._id) === String(resolvedRequesterId))?.name || "Student",
        helperName: "Pending helper",
        status: "pending",
        quantity: Number(quantity || 1),
        serviceCharge: Number(serviceCharge || 0),
        totalAmount: Number(selectedBuyFood.price || 0) * Number(quantity || 0) + Number(serviceCharge || 0),
        itNumber,
        phoneNumber,
      };

      const localRequests = JSON.parse(window.localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
      window.localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify([localRequest, ...localRequests]));
    };

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(String(selectedBuyFood._id || ""));
    if (!isObjectId) {
      saveLocalRequest();
      setSelectedBuyFood(null);
      showAlert("success", "Request saved and will appear in Request page.");
      return;
    }

    setSubmitting(true);
    try {
      await createFoodRequest({
        foodId: selectedBuyFood._id,
        requesterId: resolvedRequesterId,
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
      saveLocalRequest();
      setSelectedBuyFood(null);
      showAlert("success", "Request saved locally and will appear in Request page.");
    } finally {
      setSubmitting(false);
    }
  };

  const inStockCount = foods.filter((f) => f.inStock).length;
  const avgPrice = foods.length > 0 ? (foods.reduce((sum, f) => sum + Number(f.price), 0) / foods.length).toFixed(2) : 0;

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

      {/* Canteen Header with Enhanced Design */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50/30 p-8 shadow-soft">
        <div className="absolute top-0 right-0 opacity-10">
          <FiBox className="text-9xl text-amber-600" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-slate-900">Basement Canteen - Food & Stock</h2>
          <p className="mt-2 text-slate-600">Ground Floor • Premium food selection with real-time availability</p>
        </div>
      </div>

      {/* Enhanced Header Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-slate-500">Total Items</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{foods.length}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 p-4 text-3xl">
              🍽️
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/30 p-6 shadow-soft hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-amber-700">In Stock</p>
              <p className="mt-2 text-4xl font-black text-amber-700">{inStockCount}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-2xl text-white">
              ✓
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/30 p-6 shadow-soft hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-rose-700">Out of Stock</p>
              <p className="mt-2 text-4xl font-black text-rose-700">{foods.length - inStockCount}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 p-4 text-2xl text-white">
              ✕
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/30 p-6 shadow-soft hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-purple-700">Avg Price</p>
              <p className="mt-2 text-3xl font-black text-purple-700">LKR {avgPrice}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-2xl text-white">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section with Enhanced Design */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-3">
          <FiSearch className="text-amber-600 text-lg" />
          <h3 className="text-lg font-bold text-slate-900">Search & Filter</h3>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search food items by name..."
              className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition"
            />
          </div>

          <div className="flex gap-2">
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 cursor-pointer hover:bg-amber-50 hover:border-amber-300 transition font-semibold">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
                className="w-4 h-4"
              />
              Available
            </label>

            <button
              type="button"
              onClick={() => loadFoods()}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Food Items Grid with Enhanced Cards */}
      <div>
        {loadingFoods ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-soft flex items-center justify-center gap-3 text-slate-600">
            <FiLoader className="animate-spin text-lg" /> Loading food items...
          </div>
        ) : filteredFoods.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFoods.map((food) => (
              <div
                key={food._id}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:border-amber-300 transition-all duration-300"
              >
                {/* Image Section with Loading State */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 h-56 flex items-center justify-center">
                  {/* Loading Skeleton */}
                  {imageLoadingStates[food._id] && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse flex items-center justify-center">
                      <FiImage className="text-4xl text-slate-300" />
                    </div>
                  )}

                  {/* Main Image */}
                  <img
                    src={food.image}
                    alt={food.name}
                    onLoad={() =>
                      setImageLoadingStates((prev) => ({
                        ...prev,
                        [food._id]: false,
                      }))
                    }
                    onError={(event) => {
                      event.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format";
                      setImageLoadingStates((prev) => ({
                        ...prev,
                        [food._id]: false,
                      }));
                    }}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      opacity: imageLoadingStates[food._id] ? 0.3 : 1,
                    }}
                  />

                  {/* Overlay with category */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-slate-900 shadow-lg">
                    <span className="text-lg">{food.category.emoji}</span>
                    <span className="hidden sm:inline">{food.category.label}</span>
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute bottom-3 right-3">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-xs font-bold shadow-lg transition ${
                        food.inStock
                          ? "bg-amber-500 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {food.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-4">
                  {/* Title and Price - More Prominent */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 group-hover:text-amber-700 transition text-base line-clamp-2 leading-tight">
                      {food.name}
                    </h4>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-amber-600">LKR {Number(food.price).toFixed(2)}</p>
                      <p className="text-xs text-slate-500 pb-1">per item</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-slate-200 to-transparent"></div>

                  {/* Rating and Reviews - More Detailed */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-3 py-2">
                      <FiStar className="fill-yellow-400 text-yellow-400 text-sm" />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{food.rating}</span>
                        <span className="text-xs text-slate-600">({food.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability Quantity - Enhanced */}
                  {food.inStock && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
                          <FiTrendingUp className="text-white text-sm font-bold" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-amber-700 font-semibold">Available Now</p>
                        <p className="text-sm font-bold text-amber-900">{food.quantity} in stock</p>
                      </div>
                    </div>
                  )}

                  {/* Out of Stock Message */}
                  {!food.inStock && (
                    <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl border border-rose-200">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-rose-500 flex items-center justify-center text-white font-bold">
                          ✕
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-rose-700 font-semibold">Currently Away</p>
                        <p className="text-sm font-bold text-rose-900">Check back soon</p>
                      </div>
                    </div>
                  )}

                  {/* Quick Action Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedFood(food)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                      food.inStock
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <FiTag className="text-lg" />
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBuyFood(food)}
                    disabled={!food.inStock}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                      food.inStock
                        ? "bg-slate-900 hover:bg-slate-700 text-white"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Buy via Friend
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-16 shadow-soft flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-900 font-bold text-lg">No food items found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {selectedFood ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedFood.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{selectedFood.category.label} • Basement Canteen</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <img
              src={selectedFood.image}
              alt={selectedFood.name}
              className="h-56 w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format";
              }}
            />

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Price</p>
                <p className="mt-1 text-2xl font-extrabold text-amber-800">LKR {Number(selectedFood.price).toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Availability</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {selectedFood.inStock ? `In Stock (${selectedFood.quantity})` : "Out of Stock"}
                </p>
              </div>
              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Rating</p>
                <p className="mt-1 text-lg font-bold text-yellow-800">{selectedFood.rating} / 5 ({selectedFood.reviews} reviews)</p>
              </div>
              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">Category</p>
                <p className="mt-1 text-lg font-bold text-purple-800">{selectedFood.category.emoji} {selectedFood.category.label}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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

export default BasementFoodStockPage;
