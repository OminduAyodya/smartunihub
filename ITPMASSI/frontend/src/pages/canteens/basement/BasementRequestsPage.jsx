import { useEffect, useMemo, useState } from "react";
import { FiLoader, FiRefreshCw, FiSearch, FiUsers, FiCheckCircle, FiXCircle, FiTrendingUp, FiUser, FiHelpCircle, FiX, FiPhone, FiCreditCard } from "react-icons/fi";
import FoodItemCard from "../../../components/canteen/FoodItemCard";
import RequestCard from "../../../components/canteen/RequestCard";
import RequestFoodModal from "../../../components/canteen/RequestFoodModal";
import {
  createFoodRequest,
  getFoods,
  getIncomingRequests,
  getUserRequests,
  getUsers,
  mockFoods,
  mockUsers,
  updateFoodRequest,
  updateOwnFoodRequest,
  deleteOwnFoodRequest,
  acceptFoodRequest,
  getRequestAcceptances,
  selectHelperForRequest,
  updateUserProfile,
} from "../../../services/api";

const BasementRequestsPage = () => {
  const LOCAL_REQUESTS_KEY = "basement-local-requests";
  const ACTIVE_USER_KEY = "basement-active-user-id";
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [userRole, setUserRole] = useState("sender"); // "sender" or "acceptor"

  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [helperDetails, setHelperDetails] = useState({ itNumber: "", phoneNumber: "" });
  const [requestAcceptances, setRequestAcceptances] = useState({});
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [expandedHelperDetails, setExpandedHelperDetails] = useState(null);
  const [hideAcceptedRequests, setHideAcceptedRequests] = useState(false);
  const [hideAcceptedHelpers, setHideAcceptedHelpers] = useState(false);
  const [helperLocations, setHelperLocations] = useState({});
  const [confirmationHelper, setConfirmationHelper] = useState(null);
  const [rejectedRequests, setRejectedRequests] = useState({});
  const [helperServiceCharges, setHelperServiceCharges] = useState({});

  const currentUser = useMemo(() => {
    return users.find((user) => String(user._id) === String(currentUserId)) || null;
  }, [users, currentUserId]);

  const helperOptions = useMemo(() => {
    return users.filter((user) => user.role !== "admin" && String(user._id) !== String(currentUser?._id));
  }, [users, currentUser]);

  const nearbyStudents = useMemo(() => {
    let helpers = helperOptions.slice(0, 5);
    // If current user is an acceptor, add them to the nearby students list
    if (userRole === "acceptor" && currentUser) {
      helpers = [currentUser, ...helpers.filter((h) => String(h._id) !== String(currentUser._id))].slice(0, 5);
    }
    return helpers;
  }, [helperOptions, currentUser, userRole]);

  const helperDirectory = useMemo(
    () => Object.fromEntries(users.map((user) => [String(user._id), user])),
    [users]
  );

  const getAcceptanceHelperProfile = (acceptance) => {
    const helperRaw = acceptance?.helperId || {};
    const helperId = String(helperRaw?._id || helperRaw || "");
    const fallbackUser = helperDirectory[helperId] || {};

    return {
      helperId,
      name: helperRaw?.name || fallbackUser?.name || "Unknown helper",
      email: helperRaw?.email || fallbackUser?.email || "N/A",
      itNumber:
        helperRaw?.itNumber || helperRaw?.itNo || fallbackUser?.itNumber || fallbackUser?.itNo || "N/A",
      phoneNumber:
        helperRaw?.phoneNumber || helperRaw?.phone || fallbackUser?.phoneNumber || fallbackUser?.phone || "N/A",
      serviceCharge: helperRaw?.serviceCharge || fallbackUser?.serviceCharge || 0,
    };
  };

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
      const matchesAvailability = availableOnly ? food.inStock : true;
      return matchesSearch && matchesAvailability;
    });
  }, [foods, search, availableOnly]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.setTimeout(() => setAlert({ type: "", message: "" }), 2800);
  };

  const mapRequest = (request) => ({
    id: request._id,
    requesterId: request.requesterId?._id,
    foodName: request.foodId?.name || "Food Item",
    itemPrice: Number(request.foodId?.price || 0),
    userName: request.requesterId?.name || "Student",
    helperName: request.helperId?.name || "Unknown",
    helperItNumber: request.helperId?.itNumber || request.helperId?.itNo || "",
    helperPhoneNumber: request.helperId?.phoneNumber || request.helperId?.phone || "",
    itNumber: request.itNumber || request.requesterId?.itNumber || request.requesterId?.itNo || "",
    phoneNumber: request.phoneNumber || request.requesterId?.phoneNumber || request.requesterId?.phone || "",
    status: request.status,
    quantity: request.quantity,
    serviceCharge: Number(request.serviceCharge || 0),
    totalAmount: Number(request.foodId?.price || 0) * Number(request.quantity || 0) + Number(request.serviceCharge || 0),
  });

  const isLocalRequest = (requestId) => String(requestId || "").startsWith("local-");

  const handleEditMyRequest = async (request) => {
    if (request.status !== "pending") return;

    const nextQuantityRaw = window.prompt("Enter new quantity", String(request.quantity || 1));
    if (nextQuantityRaw === null) return;
    const nextChargeRaw = window.prompt("Enter new service charge (LKR)", String(request.serviceCharge || 0));
    if (nextChargeRaw === null) return;

    const nextQuantity = Number(nextQuantityRaw);
    const nextCharge = Number(nextChargeRaw);
    if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
      showAlert("error", "Quantity must be at least 1.");
      return;
    }
    if (!Number.isFinite(nextCharge) || nextCharge < 0) {
      showAlert("error", "Service charge cannot be negative.");
      return;
    }

    const applyLocalUpdate = () => {
      const localRequests = JSON.parse(window.localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
      const updatedLocal = localRequests.map((item) => {
        if (String(item.id || item._id) !== String(request.id)) return item;
        return {
          ...item,
          quantity: nextQuantity,
          serviceCharge: nextCharge,
          totalAmount: Number(item.itemPrice || 0) * nextQuantity + nextCharge,
        };
      });
      window.localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(updatedLocal));
      setMyRequests((prev) =>
        prev.map((item) =>
          String(item.id) === String(request.id)
            ? {
                ...item,
                quantity: nextQuantity,
                serviceCharge: nextCharge,
                totalAmount: Number(item.itemPrice || 0) * nextQuantity + nextCharge,
              }
            : item
        )
      );
    };

    if (isLocalRequest(request.id)) {
      applyLocalUpdate();
      showAlert("success", "Request updated.");
      return;
    }

    try {
      await updateOwnFoodRequest(request.id, {
        requesterId: currentUser?._id,
        quantity: nextQuantity,
        serviceCharge: nextCharge,
      });
      await loadRequests(currentUser?._id);
      showAlert("success", "Request updated.");
    } catch {
      showAlert("error", "Could not update request.");
    }
  };

  const handleDeleteMyRequest = async (request) => {
    if (request.status !== "pending") return;
    if (!window.confirm("Delete this pending request?")) return;

    const applyLocalDelete = () => {
      const localRequests = JSON.parse(window.localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
      const updatedLocal = localRequests.filter(
        (item) => String(item.id || item._id) !== String(request.id)
      );
      window.localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(updatedLocal));
      setMyRequests((prev) => prev.filter((item) => String(item.id) !== String(request.id)));
    };

    if (isLocalRequest(request.id)) {
      applyLocalDelete();
      showAlert("success", "Request deleted.");
      return;
    }

    try {
      await deleteOwnFoodRequest(request.id, { requesterId: currentUser?._id });
      await loadRequests(currentUser?._id);
      showAlert("success", "Request deleted.");
    } catch {
      showAlert("error", "Could not delete request.");
    }
  };

  const loadFoods = async (silent = false) => {
    if (!silent) setLoadingFoods(true);
    try {
      const response = await getFoods();
      const apiFoods = response.data || [];
      setFoods(apiFoods.length ? apiFoods : mockFoods);
    } catch (error) {
      setFoods(mockFoods);
      if (!silent) showAlert("error", "Backend unavailable. Showing demo foods.");
    } finally {
      if (!silent) setLoadingFoods(false);
    }
  };

  const loadUsers = async () => {
    setLoadingRequests(true);
    try {
      const usersResponse = await getUsers();
      const apiUsers = (usersResponse.data || []).filter((user) => user.role !== "admin");
      setUsers(apiUsers);
      if (!apiUsers.length) {
        setUsers(mockUsers);
        const storedUserId = window.localStorage.getItem(ACTIVE_USER_KEY);
        const resolvedUserId = mockUsers.some((user) => String(user._id) === String(storedUserId))
          ? storedUserId
          : mockUsers[0]._id;
        setCurrentUserId(resolvedUserId);
      } else {
        const storedUserId = window.localStorage.getItem(ACTIVE_USER_KEY);
        const resolvedUserId = apiUsers.some((user) => String(user._id) === String(storedUserId))
          ? storedUserId
          : apiUsers[0]._id;
        setCurrentUserId(resolvedUserId);
      }
    } catch (error) {
      setUsers(mockUsers);
      const storedUserId = window.localStorage.getItem(ACTIVE_USER_KEY);
      const resolvedUserId = mockUsers.some((user) => String(user._id) === String(storedUserId))
        ? storedUserId
        : mockUsers[0]._id;
      setCurrentUserId(resolvedUserId);
      showAlert("error", "Unable to load users or requests.");
    } finally {
      setLoadingRequests(false);
    }
  };

  const loadRequests = async (userId) => {
    if (!userId) {
      setMyRequests([]);
      setIncomingRequests([]);
      return;
    }

    setLoadingRequests(true);
    try {
      const [myResponse, incomingResponse] = await Promise.all([getUserRequests(userId), getIncomingRequests(userId)]);
      const serverRequests = (myResponse.data || []).map(mapRequest);
      const localRequests = JSON.parse(window.localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
      const mineLocal = localRequests.filter((request) => String(request.requesterId) === String(userId));
      setMyRequests([...mineLocal, ...serverRequests]);
      setIncomingRequests((incomingResponse.data || []).map(mapRequest));
    } catch (error) {
      const localRequests = JSON.parse(window.localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
      const mine = localRequests.filter((request) => String(request.requesterId) === String(userId));
      setMyRequests(mine);
      setIncomingRequests([]);
      showAlert("error", "Backend unavailable. Showing local requests only.");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadFoods();
    loadUsers();
  }, []);

  useEffect(() => {
    loadRequests(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    const pollTimer = window.setInterval(() => loadFoods(true), 10000);
    return () => window.clearInterval(pollTimer);
  }, []);

  useEffect(() => {
    setHelperDetails({
      itNumber: currentUser?.itNumber || currentUser?.itNo || "",
      phoneNumber: currentUser?.phoneNumber || currentUser?.phone || "",
      serviceCharge: currentUser?.serviceCharge || 0,
    });
  }, [currentUser]);

  const handleSaveHelperDetails = async (event) => {
    event.preventDefault();
    if (!currentUser?._id) {
      showAlert("error", "Please select a student first.");
      return;
    }

    const nextIt = String(helperDetails.itNumber || "").trim();
    const nextPhone = String(helperDetails.phoneNumber || "").trim();
    const nextCharge = Number(helperDetails.serviceCharge || 0);
    if (!nextIt || !nextPhone) {
      showAlert("error", "IT number and phone number are required.");
      return;
    }

    if (!Number.isFinite(nextCharge) || nextCharge < 0) {
      showAlert("error", "Service charge must be 0 or more.");
      return;
    }

    setSubmitting(true);
    try {
      await updateUserProfile(currentUser._id, { itNumber: nextIt, phoneNumber: nextPhone, serviceCharge: nextCharge });
      await loadUsers();
      showAlert("success", "Helper details updated.");
    } catch (error) {
      setUsers((prev) =>
        prev.map((user) =>
          String(user._id) === String(currentUser._id)
            ? { ...user, itNumber: nextIt, phoneNumber: nextPhone, serviceCharge: nextCharge }
            : user
        )
      );
      showAlert("success", "Helper details updated locally.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendRequest = async ({ helperId, quantity, serviceCharge, message, itNumber, phoneNumber }) => {
    if (!selectedFood) {
      showAlert("error", "No food selected.");
      return;
    }

    if (!currentUser?._id) {
      showAlert("error", "User not loaded. Please refresh and try again.");
      console.error("currentUser undefined:", currentUser);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        foodId: selectedFood._id,
        requesterId: currentUser._id,
        helperId: selectedHelper?._id || (helperId ?? undefined),
        quantity,
        serviceCharge,
        message,
        itNumber,
        phoneNumber,
      };

      console.log("Sending request with payload:", payload);

      await createFoodRequest(payload);
      showAlert("success", "✓ Request sent successfully! Check below to see your order");
      setSelectedFood(null);
      
      setTimeout(() => {
        loadRequests(currentUser._id);
      }, 500);
    } catch (error) {
      console.error("Error sending request:", error.response?.data || error.message);
      
      // Fallback: Save locally if backend fails
      const localRequest = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        foodId: selectedFood._id,
        foodName: selectedFood.name || "Food Item",
        itemPrice: selectedFood.price || 0,
        requesterId: currentUser._id,
        userName: currentUser.name,
        helperId: selectedHelper?._id,
        helperName: selectedHelper?.name || "Unknown",
        helperItNumber: selectedHelper?.itNumber || "",
        helperPhoneNumber: selectedHelper?.phoneNumber || "",
        itNumber,
        phoneNumber,
        quantity,
        serviceCharge,
        status: "pending",
        totalAmount: Number(selectedFood.price || 0) * Number(quantity || 0) + Number(serviceCharge || 0),
      };

      const localRequests = JSON.parse(window.localStorage.getItem(LOCAL_REQUESTS_KEY) || "[]");
      localRequests.push(localRequest);
      window.localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(localRequests));

      setMyRequests((prev) => [...prev, localRequest]);
      showAlert("success", "✓ Request saved locally. Will sync when backend is available.");
      setSelectedFood(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (requestId, status) => {
    try {
      await updateFoodRequest(requestId, { status, helperId: currentUser?._id });
      showAlert("success", `Request ${status}.`);
      await loadRequests(currentUser?._id);
    } catch (error) {
      showAlert("error", "Could not update request status.");
    }
  };

  const handleAcceptHelp = async (requestId) => {
    try {
      setSubmitting(true);
      const serviceCharge = helperServiceCharges[requestId] || 0;
      await acceptFoodRequest(requestId, currentUser?._id, serviceCharge);
      showAlert("success", "You have accepted this request! Waiting for requester to select you.");
      // Clear the service charge input for this request
      setHelperServiceCharges((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
      await loadRequests(currentUser?._id);
    } catch (error) {
      if (error.response?.data?.message?.includes("already accepted")) {
        showAlert("error", "You have already accepted this request.");
      } else {
        showAlert("error", "Failed to accept request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const loadAcceptancesForRequest = async (requestId) => {
    try {
      const response = await getRequestAcceptances(requestId);
      setRequestAcceptances((prev) => ({
        ...prev,
        [requestId]: response.data || [],
      }));
    } catch (error) {
      showAlert("error", "Could not load acceptances for this request.");
    }
  };

  const handleSelectHelper = async (requestId, acceptanceId, helperId) => {
    try {
      setSubmitting(true);
      await selectHelperForRequest(requestId, helperId);
      showAlert("success", "Helper selected! Request is now confirmed.");
      setExpandedRequest(null);
      await loadRequests(currentUser?._id);
    } catch (error) {
      showAlert("error", "Failed to select helper. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAcceptancesList = async (requestId) => {
    if (expandedRequest === requestId) {
      setExpandedRequest(null);
    } else {
      setExpandedRequest(requestId);
      if (!requestAcceptances[requestId]) {
        await loadAcceptancesForRequest(requestId);
      }
    }
  };

  const pendingCount = myRequests.filter((item) => item.status === "pending").length;
  const acceptedCount = myRequests.filter((item) => item.status === "accepted").length;
  const rejectedCount = myRequests.filter((item) => item.status === "rejected").length;
  const totalDeliveryCharges = myRequests.reduce((sum, item) => sum + Number(item.serviceCharge || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-8 shadow-soft">
        <h2 className="text-3xl font-extrabold text-slate-900">Basement Canteen - Requests & Tracking</h2>
        <p className="mt-2 text-slate-600">Ground Floor • Request food assistance and track order status</p>
      </div>

      {/* Alert Banner */}
      {alert.message && (
        <div
          className={`rounded-2xl px-6 py-4 font-semibold shadow-soft ${
            alert.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Requests</p>
              <p className="mt-2 text-3xl font-extrabold text-amber-600">{pendingCount}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/10 rounded-full blur"></div>
              <div className="relative bg-amber-100 p-3 rounded-xl text-amber-600 text-xl font-bold">!</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/30 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 font-semibold">Accepted</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-700">{acceptedCount}</p>
            </div>
            <FiCheckCircle className="text-3xl text-emerald-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/30 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-700 font-semibold">Rejected</p>
              <p className="mt-2 text-3xl font-extrabold text-rose-700">{rejectedCount}</p>
            </div>
            <FiXCircle className="text-3xl text-rose-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/30 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-semibold">Total Charges</p>
              <p className="mt-2 text-2xl font-extrabold text-purple-700">LKR {totalDeliveryCharges.toFixed(2)}</p>
            </div>
            <FiTrendingUp className="text-3xl text-purple-600" />
          </div>
        </div>
      </div>

      {/* User and Role Selector */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-900">My Role</span>
            <select
              value={userRole}
              onChange={(event) => setUserRole(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
            >
              <option value="sender">Request Sender (I need help)</option>
              <option value="acceptor">Request Acceptor (I help others)</option>
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">
            <FiUsers className="text-purple-600" /> Available Helpers
          </p>
          <div className="space-y-2">
            {nearbyStudents.length > 0 ? (
              nearbyStudents.map((student) => (
                <button
                  key={student._id}
                  type="button"
                  onClick={() => setExpandedHelperDetails(student)}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                    selectedHelper?._id === student._id
                      ? "border-purple-500 bg-purple-50 text-purple-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                >
                  <p className="flex items-center justify-between">
                    <span>{student.name}</span>
                    {selectedHelper?._id === student._id && (
                      <FiCheckCircle className="text-purple-600" />
                    )}
                  </p>
                  {student.serviceCharge > 0 && (
                    <p className="text-xs mt-1 font-semibold text-purple-600">💵 Service Charge: {student.serviceCharge}</p>
                  )}
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-500">No helpers available</p>
            )}
          </div>
        </div>

        {selectedHelper && (
          <div className="rounded-2xl border-2 border-purple-300 bg-purple-50 p-6 shadow-soft">
            <p className="mb-3 text-sm font-bold text-purple-900 flex items-center gap-2">
              <FiCheckCircle className="text-purple-600" /> Selected Helper
            </p>
            <div className="space-y-2 rounded-xl bg-white p-4 border border-purple-200">
              <p className="text-sm font-bold text-slate-900">{selectedHelper.name}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <p><span className="font-semibold">IT #:</span> {selectedHelper.itNumber || selectedHelper.itNo || "N/A"}</p>
                <p><span className="font-semibold">Phone:</span> {selectedHelper.phoneNumber || selectedHelper.phone || "N/A"}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedHelper(null);
                  showAlert("info", "Helper deselected");
                }}
                className="mt-2 w-full rounded-lg bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200 transition"
              >
                Change Helper
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper Details Modal */}
      {expandedHelperDetails ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{expandedHelperDetails.name}</h3>
                <p className="text-sm text-slate-500">Helper Details</p>
              </div>
              <button
                type="button"
                className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                onClick={() => setExpandedHelperDetails(null)}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiCreditCard className="text-slate-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">IT Number</p>
                      <p className="text-sm font-bold text-slate-900">{expandedHelperDetails.itNumber || expandedHelperDetails.itNo || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-slate-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Phone Number</p>
                      <p className="text-sm font-bold text-slate-900">{expandedHelperDetails.phoneNumber || expandedHelperDetails.phone || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCreditCard className="text-slate-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Service Charge</p>
                      <p className="text-sm font-bold text-purple-700">LKR {Number(expandedHelperDetails.serviceCharge || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {expandedHelperDetails.email && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
                  <p className="text-sm font-bold text-slate-900">{expandedHelperDetails.email}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setConfirmationHelper(expandedHelperDetails)}
                  className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700 transition"
                >
                  Select as Helper
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedHelperDetails(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Confirmation Modal for Helper Selection */}
      {confirmationHelper ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Helper Assignment</h3>
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to assign <strong>{confirmationHelper.name}</strong> to help with your order?
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2 text-xs text-slate-700">
              <p><span className="font-semibold">Name:</span> {confirmationHelper.name}</p>
              <p><span className="font-semibold">IT #:</span> {confirmationHelper.itNumber || confirmationHelper.itNo || "N/A"}</p>
              <p><span className="font-semibold">Phone:</span> {confirmationHelper.phoneNumber || confirmationHelper.phone || "N/A"}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedHelper(confirmationHelper);
                  setExpandedHelperDetails(null);
                  setConfirmationHelper(null);
                  setHelperLocations((prev) => ({
                    ...prev,
                    [confirmationHelper._id]: { distance: "2.5 km", eta: "~15 min", lat: 6.9271, lng: 80.7789 },
                  }));
                  showAlert(
                    "success",
                    `✓ Great! You've assigned ${confirmationHelper.name} as your helper. They'll receive your request soon!`
                  );
                }}
                className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700 transition"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmationHelper(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-purple-50 p-5 text-purple-800 shadow-soft">
        <p className="text-sm font-semibold">
          Food requests can be placed only from Food &amp; Stock page or Offers page. This page is for tracking your requests.
        </p>
      </div>

      {/* Request Sender Section - My Orders */}
      {userRole === "sender" && (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">My Order Status</h3>
            <p className="text-sm text-slate-600">Track your orders with service charges and delivery status.</p>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={hideAcceptedRequests}
              onChange={(e) => setHideAcceptedRequests(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span className="font-semibold text-slate-700">Hide Accepted</span>
          </label>
        </div>

        {loadingRequests ? (
          <div className="flex items-center justify-center gap-2 py-8 text-slate-600">
            <FiLoader className="animate-spin" /> Loading requests...
          </div>
        ) : myRequests.filter((r) => !hideAcceptedRequests || r.status !== "accepted").length > 0 ? (
          <div className="space-y-3">
            {myRequests.filter((r) => !hideAcceptedRequests || r.status !== "accepted").map((request) => (
              <div key={request.id}>
                <RequestCard
                  request={request}
                  helperLocation={helperLocations[request.helperId]}
                  actions={request.status === "pending" ? [
                    <button
                      key="edit"
                      type="button"
                      onClick={() => handleEditMyRequest(request)}
                      className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200 transition"
                    >
                      Edit
                    </button>,
                    <button
                      key="delete"
                      type="button"
                      onClick={() => handleDeleteMyRequest(request)}
                      className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 hover:bg-rose-200 transition"
                    >
                      Delete
                    </button>,
                  ] : null}
                />
                
                {request.status === "pending" && (
                  <div className="mt-3 ml-2 border-l-2 border-purple-200 pl-4">
                    <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => toggleAcceptancesList(request.id)}
                        className="text-sm font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-2"
                      >
                        <FiHelpCircle className="text-base" />
                        {expandedRequest === request.id ? "Hide" : "Show"} Helpers Who Accepted ({
                          hideAcceptedHelpers
                            ? (requestAcceptances[request.id]?.filter((a) => !selectedHelper || a._id !== selectedHelper._id) || []).length
                            : requestAcceptances[request.id]?.length || 0
                        })
                      </button>
                      {expandedRequest === request.id && (
                        <label className="flex items-center gap-2 text-xs cursor-pointer bg-purple-100/60 px-2 py-1 rounded">
                          <input
                            type="checkbox"
                            checked={hideAcceptedHelpers}
                            onChange={(e) => setHideAcceptedHelpers(e.target.checked)}
                            className="rounded border-slate-300"
                          />
                          <span className="font-semibold text-purple-800">Hide Selected</span>
                        </label>
                      )}
                    </div>

                    {expandedRequest === request.id && (
                      <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                        {(hideAcceptedHelpers
                          ? requestAcceptances[request.id]?.filter((a) => !selectedHelper || a._id !== selectedHelper._id)
                          : requestAcceptances[request.id]) && (hideAcceptedHelpers ? requestAcceptances[request.id]?.filter((a) => !selectedHelper || a._id !== selectedHelper._id) : requestAcceptances[request.id]).length > 0 ? (
                          (hideAcceptedHelpers ? requestAcceptances[request.id]?.filter((a) => !selectedHelper || a._id !== selectedHelper._id) : requestAcceptances[request.id]).map((acceptance) => {
                            const helperProfile = getAcceptanceHelperProfile(acceptance);
                            const isSelected = selectedHelper && selectedHelper._id === acceptance._id;
                            return (
                            <div key={acceptance._id} className={`flex items-center justify-between gap-3 rounded-lg p-3 border transition ${
                              isSelected
                                ? "bg-emerald-100 border-emerald-400 shadow-md"
                                : "bg-white border-purple-100 hover:border-purple-300"
                            }`}>
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`rounded-full p-2 ${isSelected ? "bg-emerald-200 text-emerald-700" : "bg-purple-100 text-purple-700"}`}>
                                  <FiUser />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-slate-900">{helperProfile.name}</p>
                                    {isSelected && <span className="text-xs font-bold px-2 py-1 bg-emerald-200 text-emerald-700 rounded">✓ Selected</span>}
                                  </div>
                                  <p className="text-xs text-slate-500">{helperProfile.email}</p>
                                  <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-slate-600">
                                    <p>IT: {helperProfile.itNumber}</p>
                                    <p>📱 {helperProfile.phoneNumber}</p>
                                  </div>
                                  {helperProfile.serviceCharge > 0 && (
                                    <div className="mt-2 inline-block bg-purple-100 px-2 py-1 rounded text-xs font-semibold text-purple-700">
                                      💵 Charge: LKR {Number(helperProfile.serviceCharge || 0).toFixed(2)}
                                    </div>
                                  )}
                                  {acceptance.serviceCharge > 0 && (
                                    <div className="mt-2 inline-block bg-amber-100 px-2 py-1 rounded text-xs font-semibold text-amber-800">
                                      💵 Service: LKR {Number(acceptance.serviceCharge || 0).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSelectHelper(request.id, acceptance._id, helperProfile.helperId)}
                                disabled={submitting || isSelected}
                                className={`rounded-lg px-3 py-1 text-xs font-bold transition whitespace-nowrap ${
                                  isSelected
                                    ? "bg-emerald-200 text-emerald-700 cursor-default"
                                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50"
                                }`}
                              >
                                {submitting ? "..." : isSelected ? "✓ Selected" : "Select"}
                              </button>
                            </div>
                          );
                          })
                        ) : (
                          <p className="text-sm text-slate-600 py-2">No helpers available. {hideAcceptedHelpers && "All have been selected."}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">No orders placed yet</p>
        )}
      </div>
      )}

      {/* Request Acceptor Section - Incoming Requests */}
      {userRole === "acceptor" && (
      <div className="space-y-4">
      <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-6 shadow-soft">
        <h3 className="mb-2 text-lg font-bold text-purple-900">My Helper Details</h3>
        <p className="mb-4 text-sm text-purple-800">Update these details so request senders can contact you after selecting you.</p>

        <form onSubmit={handleSaveHelperDetails} className="grid gap-3 sm:grid-cols-4">
          <input
            type="text"
            value={helperDetails.itNumber}
            onChange={(event) => setHelperDetails((prev) => ({ ...prev, itNumber: event.target.value }))}
            placeholder="IT Number"
            className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
          />
          <input
            type="text"
            value={helperDetails.phoneNumber}
            onChange={(event) => setHelperDetails((prev) => ({ ...prev, phoneNumber: event.target.value }))}
            placeholder="Phone Number"
            className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
          />
          <input
            type="number"
            min="0"
            step="1"
            value={helperDetails.serviceCharge}
            onChange={(event) => setHelperDetails((prev) => ({ ...prev, serviceCharge: Number(event.target.value) }))}
            placeholder="Service Charge (LKR)"
            className="rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700 transition disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Details"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="mb-2 text-xl font-bold text-slate-900">Help Others: Incoming Requests</h3>
        <p className="mb-4 text-sm text-slate-600">Accept requests to show interest in helping - senders will see your details and can contact you.</p>

        {loadingRequests ? (
          <div className="flex items-center justify-center gap-2 py-8 text-slate-600">
            <FiLoader className="animate-spin" /> Loading incoming requests...
          </div>
        ) : incomingRequests.length > 0 ? (
          <div className="space-y-3">
            {incomingRequests.map((request) => {
              const isRejected = rejectedRequests[request.id];
              const senderProfile = currentUser;
              return (
              <div
                key={request.id}
                className={`rounded-lg border-2 p-4 transition ${
                  isRejected
                    ? "border-rose-200 bg-rose-50"
                    : request.status === "accepted"
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <RequestCard
                      key={request.id}
                      request={request}
                    />
                  </div>
                  
                  {!isRejected && request.status === "pending" && (
                    <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
                      <div className="flex items-end gap-2">
                        <label className="flex-1">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Your Service Charge (LKR)</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={helperServiceCharges[request.id] || 0}
                            onChange={(e) => setHelperServiceCharges((prev) => ({
                              ...prev,
                              [request.id]: Number(e.target.value),
                            }))}
                            placeholder="0"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                          />
                        </label>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleAcceptHelp(request.id)}
                          disabled={submitting}
                          className="flex-1 min-w-[120px] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <FiCheckCircle /> {submitting ? "..." : "Accept"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const reason = prompt("Why can't you help? (optional)");
                            if (reason !== null) {
                              setRejectedRequests((prev) => ({
                                ...prev,
                                [request.id]: reason || "Not interested",
                              }));
                              showAlert("info", `You've declined to help. The sender will see other available helpers.`);
                            }
                          }}
                          disabled={submitting}
                          className="flex-1 min-w-[120px] rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-300 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <FiX /> {submitting ? "..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {isRejected && (
                    <div className="flex items-center justify-between pt-2 border-t border-rose-100">
                      <div className="flex items-center gap-2 text-rose-700">
                        <FiX className="text-lg" />
                        <span className="text-sm font-semibold">You declined: "{isRejected}"</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setRejectedRequests((prev) => {
                            const updated = { ...prev };
                            delete updated[request.id];
                            return updated;
                          })
                        }
                        className="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
                      >
                        Undo
                      </button>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">No incoming requests right now. Check back later!</p>
        )}
      </div>
      </div>
      )}

      {/* Submitting Indicator */}
      {submitting && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-lg flex items-center gap-2">
          <FiLoader className="animate-spin" /> Sending request...
        </div>
      )}
    </div>
  );
};

export default BasementRequestsPage;
