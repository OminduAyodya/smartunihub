import { useEffect, useState } from "react";
import { api } from "../services/api";

const RequestForm = ({ foods, currentUser, nearbyUsers, onRequestCreated }) => {
  const [foodId, setFoodId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [serviceCharge, setServiceCharge] = useState(50);
  const [receiver, setReceiver] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (foods.length > 0 && !foodId) {
      setFoodId(foods[0]._id);
    }

    if (!receiver) {
      const defaultReceiver = nearbyUsers[0];
      if (defaultReceiver) setReceiver(defaultReceiver._id);
    }
  }, [foods, foodId, receiver, nearbyUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?._id || !foodId || !receiver) {
      alert("Please select food item and nearby student");
      return;
    }

    try {
      setSending(true);
      const payload = {
        sender: currentUser._id,
        receiver,
        items: [{ foodItem: foodId, quantity: Number(quantity) }],
        note,
        serviceCharge: Number(serviceCharge),
      };

      const { data } = await api.post("/request", payload);
      onRequestCreated(data);
      setNote("");
      setQuantity(1);
      alert("Request sent successfully");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to send request. Make sure backend is running and users are seeded.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel-glass p-5">
      <h3 className="text-lg font-bold text-slate-900">Request Food</h3>
      <p className="mb-4 text-sm text-slate-500">Ask a nearby student to collect food for you.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Food Item
          <select
            value={foodId}
            onChange={(e) => setFoodId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          >
            {foods.map((food) => (
              <option key={food._id} value={food._id}>
                {food.name} (Stock: {food.stock})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Nearby Student
          <select
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
          >
            {nearbyUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Quantity
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Service Charge (LKR)
          <input
            type="number"
            min="0"
            value={serviceCharge}
            onChange={(e) => setServiceCharge(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1 text-sm font-medium text-slate-700">
        Note
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="3"
          placeholder="Any extra note for your friend..."
          className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
        />
      </label>

      <button
        disabled={sending}
        type="submit"
        className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {sending ? "Sending..." : "Submit Request"}
      </button>
    </form>
  );
};

export default RequestForm;
