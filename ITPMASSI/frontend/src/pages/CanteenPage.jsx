import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiSearch } from "react-icons/fi";
import FoodItemCard from "../components/canteen/FoodItemCard";
import RequestCard from "../components/canteen/RequestCard";
import RequestFoodModal from "../components/canteen/RequestFoodModal";
import {
  acceptRequest,
  createFoodRequest,
  getFoods,
  getIncomingRequests,
  getUserRequests,
  getWallet,
  rejectRequest,
} from "../services/api";

const ACTIVE_USER_ID = 1;

const fallbackFoods = [
  { id: 1, name: "Chicken Kottu", price: 550, stock: 12, offer: "10% Off" },
  { id: 2, name: "Veg Rice", price: 300, stock: 8, offer: null },
  { id: 3, name: "Fruit Juice", price: 220, stock: 0, offer: "Buy 1 Get 1" },
  { id: 4, name: "Pasta", price: 480, stock: 5, offer: null },
];

const fallbackWallet = { userId: ACTIVE_USER_ID, walletBalance: 1850, earnings: 420 };

const fallbackRequests = [
  {
    id: 1001,
    foodName: "Chicken Kottu",
    userName: "Ayesha Perera",
    helperName: null,
    quantity: 1,
    status: "PENDING",
    serviceCharge: 40,
    pickupTime: "12:45",
  },
  {
    id: 1002,
    foodName: "Veg Rice",
    userName: "Ayesha Perera",
    helperName: "Nimal Fernando",
    quantity: 2,
    status: "ACCEPTED",
    serviceCharge: 60,
    pickupTime: "13:10",
  },
  {
    id: 1003,
    foodName: "Pasta",
    userName: "Ayesha Perera",
    helperName: "Kavindu Silva",
    quantity: 1,
    status: "COMPLETED",
    serviceCharge: 50,
    pickupTime: "11:45",
  },
];

const CanteenPage = () => {
  const [foods, setFoods] = useState([]);
  const [requests, setRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [wallet, setWallet] = useState(fallbackWallet);
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const mapRequest = (request) => ({
    id: request.id,
    foodName: request.foodName || request.food?.name || "Food Item",
    userName: request.userName || request.user?.name || "Student",
    helperName: request.helperName || request.helper?.name || null,
    quantity: request.quantity,
    status: request.status,
    serviceCharge: request.serviceCharge,
    pickupTime: request.pickupTime,
  });

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const [foodsRes, userReqRes, incomingRes, walletRes] = await Promise.all([
        getFoods(),
        getUserRequests(ACTIVE_USER_ID),
        getIncomingRequests(),
        getWallet(ACTIVE_USER_ID),
      ]);

      setFoods(foodsRes.data || []);
      setRequests((userReqRes.data || []).map(mapRequest));
      setIncomingRequests((incomingRes.data || []).map(mapRequest));
      setWallet(walletRes.data || fallbackWallet);
    } catch (error) {
      if (!silent) {
        setFoods(fallbackFoods);
        setRequests(fallbackRequests);
        setIncomingRequests(fallbackRequests.filter((item) => item.status === "PENDING"));
        setWallet(fallbackWallet);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Lightweight real-time behavior through polling.
    const interval = setInterval(() => loadData(true), 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
      const matchesAvailability = availableOnly ? food.stock > 0 : true;
      return matchesSearch && matchesAvailability;
    });
  }, [foods, search, availableOnly]);

  const pendingRequests = requests.filter((item) => item.status === "PENDING");
  const acceptedRequests = requests.filter((item) => item.status === "ACCEPTED");
  const completedRequests = requests.filter((item) => item.status === "COMPLETED");

  const sendFoodRequest = async ({ quantity, pickupTime, note }) => {
    if (!selectedFood) return;

    try {
      await createFoodRequest({
        userId: ACTIVE_USER_ID,
        foodId: selectedFood.id,
        quantity,
        pickupTime,
        note,
      });

      showToast("Food request sent successfully.");
      setSelectedFood(null);
      loadData(true);
    } catch (error) {
      showToast("Request saved locally (backend unavailable).");
      setRequests((prev) => [
        {
          id: Date.now(),
          foodName: selectedFood.name,
          userName: "Ayesha Perera",
          helperName: null,
          quantity,
          status: "PENDING",
          serviceCharge: 50,
          pickupTime,
        },
        ...prev,
      ]);
      setSelectedFood(null);
    }
  };

  const handleIncomingAction = async (id, actionType) => {
    try {
      if (actionType === "ACCEPT") await acceptRequest(id);
      if (actionType === "REJECT") await rejectRequest(id);
      showToast(`Request ${actionType.toLowerCase()}ed.`);
      loadData(true);
    } catch (error) {
      showToast("Action saved locally.");
      setIncomingRequests((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: actionType === "ACCEPT" ? "ACCEPTED" : "REJECTED",
                helperName: "You",
              }
            : item
        )
      );
    }
  };

  return (
    <div className="space-y-5">
      <section className="panel-glass p-5">
        <h2 className="text-2xl font-extrabold text-slate-900">Canteen Assistance</h2>
        <p className="mt-1 text-sm text-slate-500">Order food or request help from friends</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="panel-glass p-4">
          <p className="text-sm text-slate-500">Wallet Balance</p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-900">LKR {Number(wallet.walletBalance).toFixed(2)}</h3>
        </article>
        <article className="panel-glass p-4">
          <p className="text-sm text-slate-500">Earnings (Helping Others)</p>
          <h3 className="mt-2 text-2xl font-extrabold text-emerald-700">LKR {Number(wallet.earnings || 0).toFixed(2)}</h3>
        </article>
        <article className="panel-glass p-4">
          <p className="text-sm text-slate-500">Quick Sync</p>
          <button
            type="button"
            onClick={() => loadData()}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <FiRefreshCw /> Refresh Data
          </button>
        </article>
      </section>

      <section className="panel-glass p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-slate-900">Food Items</h3>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food"
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-brand-400 focus:outline-none sm:w-56"
              />
            </label>

            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Available only
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredFoods.map((food) => (
            <FoodItemCard key={food.id} item={food} onRequest={setSelectedFood} />
          ))}
        </div>

        {!filteredFoods.length ? <p className="mt-4 text-sm text-slate-500">No food items found.</p> : null}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="panel-glass p-5">
          <h3 className="text-lg font-bold text-slate-900">Assistance Requests</h3>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-amber-700">Pending Requests</h4>
              <div className="space-y-2">
                {pendingRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
                {!pendingRequests.length ? <p className="text-sm text-slate-500">No pending requests.</p> : null}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-sky-700">Accepted Requests</h4>
              <div className="space-y-2">
                {acceptedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
                {!acceptedRequests.length ? <p className="text-sm text-slate-500">No accepted requests.</p> : null}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-emerald-700">Completed Requests</h4>
              <div className="space-y-2">
                {completedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
                {!completedRequests.length ? <p className="text-sm text-slate-500">No completed requests.</p> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="panel-glass p-5">
          <h3 className="text-lg font-bold text-slate-900">Incoming Requests (Helpers)</h3>
          <div className="mt-4 space-y-2">
            {incomingRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                actions={
                  request.status === "PENDING"
                    ? [
                        <button
                          key="accept"
                          type="button"
                          onClick={() => handleIncomingAction(request.id, "ACCEPT")}
                          className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                        >
                          Accept
                        </button>,
                        <button
                          key="reject"
                          type="button"
                          onClick={() => handleIncomingAction(request.id, "REJECT")}
                          className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                        >
                          Reject
                        </button>,
                      ]
                    : null
                }
              />
            ))}
            {!incomingRequests.length ? <p className="text-sm text-slate-500">No incoming helper requests.</p> : null}
          </div>
        </div>
      </section>

      <RequestFoodModal
        isOpen={Boolean(selectedFood)}
        selectedFood={selectedFood}
        onClose={() => setSelectedFood(null)}
        onSubmit={sendFoodRequest}
      />

      {loading ? <section className="panel-glass p-4 text-sm text-slate-500">Loading canteen data...</section> : null}

      {toastMessage ? (
        <div className="fixed bottom-5 right-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
};

export default CanteenPage;
