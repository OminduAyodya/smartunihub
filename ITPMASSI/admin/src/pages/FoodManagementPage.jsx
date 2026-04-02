import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiLoader, FiRefreshCw, FiSearch, FiCheck, FiX, FiImage } from "react-icons/fi";
import { API_BASE_URL } from "../config/api";
import { useCanteen } from "../context/CanteenContext";

const FoodManagementPage = () => {
  const { selectedCanteen } = useCanteen();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    imageFile: null,
    inStock: true,
  });

  const filteredFoods = useMemo(() => {
    if (!Array.isArray(foods)) return [];
    return foods.filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [foods, search]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const loadFoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/foods?canteen=${selectedCanteen}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const data = await response.json();
      setFoods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load foods:", error);
      setFoods([]);
      showAlert("error", "Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, [selectedCanteen]);

  const resetForm = () => {
    setFormData({ name: "", price: "", image: "", imageFile: null, inStock: true });
    setImagePreview(null);
    setEditingId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      name: food.name,
      price: food.price,
      image: food.image,
      imageFile: null,
      inStock: food.inStock,
    });
    setImagePreview(food.image);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      showAlert("error", "Food name and price are required");
      return;
    }

    if (!editingId && !formData.imageFile) {
      showAlert("error", "Please select an image for new food item");
      return;
    }

    try {
      setUploading(true);
      let imageUrl = formData.image;

      // Upload new image if file is selected
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const url = editingId ? `${API_BASE_URL}/api/foods/${editingId}` : `${API_BASE_URL}/api/foods`;
      const method = editingId ? "PUT" : "POST";
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        image: imageUrl || undefined,
        inStock: formData.inStock,
        canteen: selectedCanteen,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        showAlert("error", error.message || "Failed to save food");
        return;
      }

      await loadFoods();
      resetForm();
      setShowForm(false);
      setUploading(false);
      showAlert("success", editingId ? "Food updated successfully" : "Food added successfully");
    } catch (error) {
      setUploading(false);
      showAlert("error", "Failed to save food");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/foods/${id}`, { method: "DELETE" });

      if (!response.ok) {
        showAlert("error", "Failed to delete food");
        return;
      }

      await loadFoods();
      showAlert("success", "Food deleted successfully");
    } catch (error) {
      showAlert("error", "Failed to delete food");
    }
  };

  const toggleStock = async (id, currentStock) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/foods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: !currentStock }),
      });

      if (!response.ok) {
        showAlert("error", "Failed to update stock");
        return;
      }

      await loadFoods();
      showAlert("success", `Food marked as ${!currentStock ? "in stock" : "out of stock"}`);
    } catch (error) {
      showAlert("error", "Failed to update stock");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Food Management</h1>
          <p className="text-slate-400 mt-2">Add, edit, and manage food items</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <FiPlus />
          {showForm ? "Cancel" : "Add Food"}
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
            {editingId ? "Edit Food Item" : "Add New Food Item"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Chicken Fried Rice"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Food Image {!editingId && "*"}
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 border-dashed rounded-lg cursor-pointer hover:bg-slate-600 transition">
                  <div className="flex items-center justify-center gap-2 text-slate-300">
                    <FiImage />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-600">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-slate-300">In Stock</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full px-4 py-2 rounded-lg transition font-medium flex items-center justify-center gap-2 ${
                uploading
                  ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {uploading && <FiLoader className="animate-spin" />}
              {uploading ? "Uploading..." : editingId ? "Update Food" : "Add Food"}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Foods Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Food Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Price (LKR)
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Stock Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <FiLoader className="animate-spin" />
                      Loading foods...
                    </div>
                  </td>
                </tr>
              ) : filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                    No foods found
                  </td>
                </tr>
              ) : (
                filteredFoods.map((food) => (
                  <tr key={food._id} className="border-t border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="px-6 py-4 text-white">{food.name}</td>
                    <td className="px-6 py-4 text-slate-300">LKR {food.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStock(food._id, food.inStock)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition ${
                          food.inStock
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        }`}
                      >
                        {food.inStock ? (
                          <>
                            <FiCheck size={14} />
                            In Stock
                          </>
                        ) : (
                          <>
                            <FiX size={14} />
                            Out of Stock
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(food)}
                          className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 transition"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(food._id)}
                          className="p-2 hover:bg-slate-700 rounded-lg text-red-400 transition"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FoodManagementPage;
