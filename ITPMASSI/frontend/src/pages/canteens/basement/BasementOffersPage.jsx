import { FiGift, FiTag, FiClock, FiTrendingUp } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, mockUsers } from "../../../services/api";

const promotions = [
  {
    id: "offer-1",
    title: "Basement Special Combo",
    discount: "15% OFF",
    description: "Exclusive deals available only at Basement Canteen.",
    icon: "🍱",
    time: "11:30 AM - 2:30 PM",
    badge: "BASEMENT ONLY",
  },
  {
    id: "offer-2",
    title: "Evening Snacks Deal",
    discount: "Buy 2 Get 1",
    description: "Available during evening hours.",
    icon: "🥐",
    time: "3:00 PM - 5:30 PM",
    badge: "EVENING",
  },
  {
    id: "offer-3",
    title: "Student Bundle",
    discount: "LKR 30 OFF",
    description: "Perfect for quick study breaks.",
    icon: "📚",
    time: "All Day",
    badge: "POPULAR",
  },
  {
    id: "offer-4",
    title: "Drinks Promo",
    discount: "FREE Upgrade",
    description: "Upgrade to larger size free.",
    icon: "🥤",
    time: "Noon - Evening",
    badge: "LIMITED",
  },
];

const BasementOffersPage = () => {
  const LOCAL_REQUESTS_KEY = "basement-local-requests";
  const ACTIVE_USER_KEY = "basement-active-user-id";
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [users, setUsers] = useState([]);
  const [requesterId, setRequesterId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersResponse = await getUsers();
        const apiUsers = (usersResponse.data || []).filter((user) => user.role !== "admin");
        const nextUsers = apiUsers.length ? apiUsers : mockUsers;
        setUsers(nextUsers);

        const storedUserId = window.localStorage.getItem(ACTIVE_USER_KEY);
        const resolvedRequesterId = nextUsers.some((user) => String(user._id) === String(storedUserId))
          ? storedUserId
          : nextUsers[0]?._id || "";
        setRequesterId(resolvedRequesterId);
      } catch {
        setUsers(mockUsers);
        const storedUserId = window.localStorage.getItem(ACTIVE_USER_KEY);
        const resolvedRequesterId = mockUsers.some((user) => String(user._id) === String(storedUserId))
          ? storedUserId
          : mockUsers[0]?._id || "";
        setRequesterId(resolvedRequesterId);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (!selectedOffer) return;
    setQuantity(0);
    setMessage("");
    setFormErrors({});
  }, [selectedOffer]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.setTimeout(() => setAlert({ type: "", message: "" }), 2800);
  };

  const saveOfferRequest = (offer) => {
    const nextErrors = {};
    const qty = Number(quantity);

    if (!requesterId) {
      nextErrors.requesterId = "Requester is required.";
    }
    if (!Number.isFinite(qty) || !Number.isInteger(qty)) {
      nextErrors.quantity = "Quantity must be a whole number greater than 0.";
    } else if (qty === 0) {
      nextErrors.quantity = "PLEASE ENTER QTY";
    } else if (qty < 0) {
      nextErrors.quantity = "Quantity must be a whole number greater than 0.";
    }
    if (String(message || "").length > 250) {
      nextErrors.message = "Message cannot exceed 250 characters.";
    }

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    window.localStorage.setItem(ACTIVE_USER_KEY, String(requesterId));
    const requesterName = users.find((user) => String(user._id) === String(requesterId))?.name || "Student";
    const itemPrice = 0;
    const localRequest = {
      id: `local-${Date.now()}`,
      _id: `local-${Date.now()}`,
      requesterId,
      foodName: `${offer.title} (Offer)`,
      itemPrice,
      userName: requesterName,
      helperName: "Pending helper",
      status: "pending",
      quantity: qty,
      serviceCharge: 0,
      message,
      totalAmount: itemPrice * qty,
    };

    const localRequests = JSON.parse(window.localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
    window.localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify([localRequest, ...localRequests]));
    showAlert("success", "Offer request sent. You can view it in Requests page.");
  };

  const badgeColors = {
    "BASEMENT ONLY": "bg-purple-100 text-purple-700",
    EVENING: "bg-orange-100 text-orange-700",
    POPULAR: "bg-emerald-100 text-emerald-700",
    LIMITED: "bg-rose-100 text-rose-700",
    BESTSELLER: "bg-rose-100 text-rose-700",
    "LIMITED TIME": "bg-amber-100 text-amber-700",
    AVAILABLE: "bg-emerald-100 text-emerald-700",
    WEEKEND: "bg-blue-100 text-blue-700",
    GROUP: "bg-indigo-100 text-indigo-700",
  };

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

      {/* Header Section */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 p-8 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Basement Canteen - Offers & Promotions</h2>
            <p className="mt-2 text-slate-600">
              Check out the latest deals & discounts at <span className="font-bold text-purple-700">Basement Canteen (Ground Floor)</span>
            </p>
          </div>
          <div className="text-5xl">🎉</div>
        </div>
      </div>

      {/* Active Promotions Count */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <FiTrendingUp className="text-2xl text-purple-600" />
          <div>
            <p className="text-sm text-slate-600">Active Promotions</p>
            <p className="text-2xl font-extrabold text-slate-900">{promotions.length} Offers</p>
          </div>
        </div>
      </div>

      {/* Promotion Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((offer) => (
          <div
            key={offer.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedOffer(offer)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setSelectedOffer(offer);
              }
            }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft hover:shadow-lg hover:border-purple-300/60 transition"
          >
            {/* Card Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition" />

            <div className="relative p-6">
              {/* Badge */}
              <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold mb-3 ${badgeColors[offer.badge] || "bg-slate-100 text-slate-700"}`}>
                {offer.badge}
              </div>

              {/* Icon and Title */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition">{offer.title}</h3>
                </div>
                <div className="text-3xl">{offer.icon}</div>
              </div>

              {/* Discount Highlight */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-sm font-extrabold text-white">
                <FiTag className="text-base" />
                {offer.discount}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4">{offer.description}</p>

              {/* Time Info */}
              <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-4">
                <FiClock className="text-purple-600" />
                <span>{offer.time}</span>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 border-2 border-purple-400/0 group-hover:border-purple-400/30 rounded-2xl pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/30 p-8 text-center shadow-soft">
        <h3 className="text-2xl font-extrabold text-slate-900">Special Basement Deals! 🎊</h3>
        <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
          Visit Basement Canteen for unique offers. Check back regularly for new promotions and exclusive deals!
        </p>
        <button
          type="button"
          onClick={() => {
            if (!promotions.length) return;
            const currentIndex = selectedOffer
              ? promotions.findIndex((item) => item.id === selectedOffer.id)
              : -1;
            const nextIndex = (currentIndex + 1) % promotions.length;
            setSelectedOffer(promotions[nextIndex]);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-bold text-white hover:shadow-lg transition hover:-translate-y-0.5"
        >
          View More Details
        </button>
      </div>

      {selectedOffer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <p className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${badgeColors[selectedOffer.badge] || "bg-slate-100 text-slate-700"}`}>
                  {selectedOffer.badge}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-slate-900">{selectedOffer.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">Discount</p>
                <p className="mt-1 text-xl font-extrabold text-purple-800">{selectedOffer.discount}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Offer Details</p>
                <p className="mt-1 text-sm text-slate-700">{selectedOffer.description}</p>
              </div>

              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Available Time</p>
                <p className="mt-1 text-sm font-bold text-amber-800">{selectedOffer.time}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Send Request Form</p>

                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-slate-700">Requester</span>
                  <select
                    value={requesterId}
                    onChange={(event) => {
                      setRequesterId(event.target.value);
                      setFormErrors((prev) => ({ ...prev, requesterId: "" }));
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  >
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                  </select>
                  {formErrors.requesterId ? <p className="mt-1 text-xs font-semibold text-rose-600">{formErrors.requesterId}</p> : null}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-semibold text-slate-700">Quantity</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={quantity}
                      onChange={(event) => {
                        setQuantity(event.target.value);
                        setFormErrors((prev) => ({ ...prev, quantity: "" }));
                      }}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    />
                    {formErrors.quantity ? <p className="mt-1 text-xs font-semibold text-rose-600">{formErrors.quantity}</p> : null}
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-slate-700">Message (optional)</span>
                  <textarea
                    rows={2}
                    maxLength={250}
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                      setFormErrors((prev) => ({ ...prev, message: "" }));
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="Add a note for helper"
                  />
                  <div className="mt-1 flex items-center justify-between">
                    {formErrors.message ? <p className="text-xs font-semibold text-rose-600">{formErrors.message}</p> : <span />}
                    <p className="text-[11px] text-slate-500">{String(message || "").length}/250</p>
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={() => saveOfferRequest(selectedOffer)}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Send Offer Request
              </button>

              <button
                type="button"
                onClick={() => navigate("/basement/food-stock")}
                className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700"
              >
                Go To Food & Stock
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BasementOffersPage;
