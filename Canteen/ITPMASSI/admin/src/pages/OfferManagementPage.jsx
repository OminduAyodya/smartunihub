import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiSearch, FiCheck } from "react-icons/fi";
import { API_BASE_URL } from "../config/api";
import { useCanteen } from "../context/CanteenContext";

const OfferManagementPage = () => {
  const { selectedCanteen } = useCanteen();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    discount: "",
    description: "",
    icon: "🎁",
    startTime: "",
    endTime: "",
    badge: "OFFER",
    isActive: true,
  });

  const filteredOffers = useMemo(() => {
    if (!Array.isArray(offers)) return [];
    return offers.filter((offer) =>
      offer.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [offers, search]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const loadOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/offers?canteen=${selectedCanteen}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const data = await response.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load offers:", error);
      setOffers([]);
      showAlert("error", "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, [selectedCanteen]);

  const resetForm = () => {
    setFormData({
      title: "",
      discount: "",
      description: "",
      icon: "🎁",
      startTime: "",
      endTime: "",
      badge: "OFFER",
      isActive: true,
    });
    setEditingId(null);
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setFormData({
      title: offer.title,
      discount: offer.discount,
      description: offer.description,
      icon: offer.icon,
      startTime: offer.startTime,
      endTime: offer.endTime,
      badge: offer.badge,
      isActive: offer.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.discount || !formData.description || !formData.startTime || !formData.endTime) {
      showAlert("error", "All fields are required");
      return;
    }

    try {
      const url = editingId ? `${API_BASE_URL}/api/offers/${editingId}` : `${API_BASE_URL}/api/offers`;
      const method = editingId ? "PUT" : "POST";
      const payload = {
        ...formData,
        canteen: selectedCanteen,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        showAlert("error", error.message || "Failed to save offer");
        return;
      }

      await loadOffers();
      resetForm();
      setShowForm(false);
      showAlert("success", editingId ? "Offer updated successfully" : "Offer added successfully");
    } catch (error) {
      showAlert("error", "Failed to save offer");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/offers/${id}`, { method: "DELETE" });

      if (!response.ok) {
        showAlert("error", "Failed to delete offer");
        return;
      }

      await loadOffers();
      showAlert("success", "Offer deleted successfully");
    } catch (error) {
      showAlert("error", "Failed to delete offer");
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/offers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        showAlert("error", "Failed to update offer");
        return;
      }

      await loadOffers();
      showAlert("success", !currentStatus ? "Offer activated" : "Offer deactivated");
    } catch (error) {
      showAlert("error", "Failed to update offer");
    }
  };

  const emojis = ["🎁", "🎉", "🏆", "💎", "🌟", "🔥", "🎯", "💰", "🎊", "🍱", "🥐", "📚", "🥤"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Offer Management</h1>
          <p className="text-slate-400 mt-2">Create, edit, and manage special offers & promotions</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
        >
          <FiPlus />
          {showForm ? "Cancel" : "Add Offer"}
        </button>
      </div>

      {/* Alert */}
      {alert.message && (
        <div
          className={`p-4 rounded-lg ${
            alert.type === "error"
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-green-500/10 text-green-400 border border-green-500/20"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {editingId ? "Edit Offer" : "Add New Offer"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Basement Special Combo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Discount *
                </label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 15% OFF, Buy 2 Get 1, LKR 30 OFF"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Details about this offer"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {emojis.map((emoji) => (
                    <option key={emoji} value={emoji}>
                      {emoji}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Badge Type
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., POPULAR, LIMITED, BASEMENT ONLY"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-slate-300">Active</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
            >
              {editingId ? "Update Offer" : "Add Offer"}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search offers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center gap-2 text-slate-400 py-12">
            <FiLoader className="animate-spin" />
            Loading offers...
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 py-12">
            No offers found
          </div>
        ) : (
          filteredOffers.map((offer) => (
            <div
              key={offer._id}
              className={`bg-slate-800 border rounded-lg p-5 transition ${
                offer.isActive ? "border-slate-700 hover:border-slate-600" : "border-slate-700/50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{offer.icon}</span>
                  <div>
                    <h3 className="font-bold text-white">{offer.title}</h3>
                    <p className="text-xs text-slate-400">{offer.discount}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    offer.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {offer.badge}
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-3">{offer.description}</p>

              <div className="text-xs text-slate-400 mb-4">
                <div>⏰ {offer.startTime} - {offer.endTime}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(offer._id, offer.isActive)}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    offer.isActive
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                  }`}
                >
                  <FiCheck />
                  {offer.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => handleEdit(offer)}
                  className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 transition"
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="p-2 hover:bg-slate-700 rounded-lg text-red-400 transition"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfferManagementPage;
