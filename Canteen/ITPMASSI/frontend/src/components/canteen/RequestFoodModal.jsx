import { useEffect, useState } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";

const RequestFoodModal = ({
  isOpen,
  selectedFood,
  friends = [],
  requesters = [],
  defaultRequesterId = "",
  currentUserDetails = {},
  onClose,
  onSubmit,
}) => {
  const [requesterId, setRequesterId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [message, setMessage] = useState("");
  const [itNumber, setItNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    setRequesterId(defaultRequesterId || requesters?.[0]?._id || "");
    setQuantity(0);
    setServiceCharge(0);
    setMessage("");
    setItNumber(currentUserDetails?.itNumber || currentUserDetails?.itNo || "");
    setPhoneNumber(currentUserDetails?.phoneNumber || currentUserDetails?.phone || "");
    setErrors({});
  }, [isOpen, selectedFood, friends, requesters, defaultRequesterId, currentUserDetails]);

  if (!isOpen || !selectedFood) return null;

  const submitRequest = (event) => {
    event.preventDefault();

    const nextErrors = {};
    const qty = Number(quantity);
    const charge = Number(serviceCharge);


    
    // Validate requesterId if there are requesters available

    if (requesters.length > 0 && !requesterId) {
      nextErrors.requesterId = "Requester is required.";
    }

    const trimmedIt = String(itNumber || "").trim();
    if (!trimmedIt) {
      nextErrors.itNumber = "IT Number is required.";
    } else if (!/^[A-Za-z0-9\-/]+$/.test(trimmedIt)) {
      nextErrors.itNumber = "IT Number format is invalid.";
    }

    const trimmedPhone = String(phoneNumber || "").trim();
    if (!trimmedPhone) {
      nextErrors.phoneNumber = "Phone Number is required.";
    } else if (!/^[0-9\-+\s()]{7,}$/.test(trimmedPhone)) {
      nextErrors.phoneNumber = "Phone Number must be at least 7 digits.";
    }

    if (!Number.isFinite(qty) || !Number.isInteger(qty)) {
      nextErrors.quantity = "Quantity must be a whole number greater than 0.";
    } else if (qty === 0) {
      nextErrors.quantity = "PLEASE ENTER QTY";
    } else if (qty < 0) {
      nextErrors.quantity = "Quantity must be a whole number greater than 0.";
    }

    if (!Number.isFinite(charge) || charge < 0) {
      nextErrors.serviceCharge = "Help charge must be 0 or more.";
    }

    if (String(message || "").length > 250) {
      nextErrors.message = "Message cannot exceed 250 characters.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      requesterId: requesterId || undefined,
      quantity: qty,
      serviceCharge: charge,
      message,
      itNumber: trimmedIt,
      phoneNumber: trimmedPhone,
    });
  };

  const subtotal = Number(selectedFood?.price || 0) * Number(quantity || 0);
  const totalPayable = subtotal + Number(serviceCharge || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Request Food</h3>
            <p className="text-sm text-slate-500">{selectedFood.name}</p>
          </div>
          <button
            type="button"
            className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={submitRequest} className="space-y-4">
          {requesters.length ? (
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Requester</span>
              <select
                value={requesterId}
                onChange={(e) => {
                  setRequesterId(e.target.value);
                  setErrors((prev) => ({ ...prev, requesterId: "" }));
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
                required
              >
                {requesters.map((requester) => (
                  <option key={requester._id} value={requester._id}>
                    {requester.name}
                  </option>
                ))}
              </select>
              {errors.requesterId ? (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-rose-50 p-2.5 border border-rose-200">
                  <FiAlertCircle className="mt-0.5 text-rose-600 flex-shrink-0" />
                  <p className="text-xs font-semibold text-rose-700">{errors.requesterId}</p>
                </div>
              ) : null}
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Quantity</span>
            <input
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors((prev) => ({ ...prev, quantity: "" }));
              }}
              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none transition ${
                errors.quantity
                  ? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  : "border-slate-200 focus:border-brand-400"
              }`}
              required
            />
            {errors.quantity ? (
              <div className="mt-2 flex items-start gap-2 rounded-lg bg-rose-50 p-2.5 border border-rose-200">
                <FiAlertCircle className="mt-0.5 text-rose-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-rose-700">{errors.quantity}</p>
              </div>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Food Price (LKR)</span>
            <div className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 text-slate-700 font-semibold">
              {Number(selectedFood?.price || 0).toFixed(2)}
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">IT Number *</span>
            <input
              type="text"
              value={itNumber}
              onChange={(e) => {
                setItNumber(e.target.value);
                setErrors((prev) => ({ ...prev, itNumber: "" }));
              }}
              placeholder="e.g., IT23-001"
              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none transition ${
                errors.itNumber
                  ? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  : "border-slate-200 focus:border-brand-400"
              }`}
              required
            />
            {errors.itNumber ? (
              <div className="mt-2 flex items-start gap-2 rounded-lg bg-rose-50 p-2.5 border border-rose-200">
                <FiAlertCircle className="mt-0.5 text-rose-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-rose-700">{errors.itNumber}</p>
              </div>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Phone Number *</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setErrors((prev) => ({ ...prev, phoneNumber: "" }));
              }}
              placeholder="e.g., +94 77 123 4567"
              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none transition ${
                errors.phoneNumber
                  ? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  : "border-slate-200 focus:border-brand-400"
              }`}
              required
            />
            {errors.phoneNumber ? (
              <div className="mt-2 flex items-start gap-2 rounded-lg bg-rose-50 p-2.5 border border-rose-200">
                <FiAlertCircle className="mt-0.5 text-rose-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-rose-700">{errors.phoneNumber}</p>
              </div>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Message (optional)</span>
            <textarea
              rows="3"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setErrors((prev) => ({ ...prev, message: "" }));
              }}
              placeholder="Add a message for your friend"
              maxLength={250}
              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none transition ${
                errors.message
                  ? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  : "border-slate-200 focus:border-brand-400"
              }`}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.message ? (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-rose-50 p-2.5 border border-rose-200 flex-1">
                  <FiAlertCircle className="mt-0.5 text-rose-600 flex-shrink-0" />
                  <p className="text-xs font-semibold text-rose-700">{errors.message}</p>
                </div>
              ) : (
                <span />
              )}
              <p className="text-[11px] text-slate-500">{String(message || "").length}/250</p>
            </div>
          </label>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <p>Food unit price: LKR {Number(selectedFood?.price || 0).toFixed(2)}</p>
            <p>Quantity: {quantity}</p>
            <p className="mt-1 font-bold text-slate-900">Total to pay: LKR {subtotal.toFixed(2)}</p>
          </div>

          <button
            type="submit"
            disabled={requesters.length > 0 && !requesterId}
            className="w-full rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Send Help Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestFoodModal;
