const OrderHistory = ({ requests }) => {
  const completed = requests.filter((req) => req.status === "Completed");

  return (
    <section className="panel-glass p-5">
      <h3 className="text-lg font-bold text-slate-900">Order History</h3>
      <p className="text-sm text-slate-500">Completed requests with service charges.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="pb-2">Date</th>
              <th className="pb-2">Food Item</th>
              <th className="pb-2">Quantity</th>
              <th className="pb-2">Collected By</th>
              <th className="pb-2">Charge</th>
            </tr>
          </thead>
          <tbody>
            {completed.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-3 text-slate-500">
                  No completed orders yet.
                </td>
              </tr>
            ) : (
              completed.map((request) => (
                <tr key={request._id} className="border-t border-slate-100">
                  <td className="py-2">{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">{request.items?.[0]?.foodItem?.name || "Food item"}</td>
                  <td className="py-2">{request.items?.[0]?.quantity || 1}</td>
                  <td className="py-2">{request.receiver?.name || "Unknown"}</td>
                  <td className="py-2">LKR {request.serviceCharge || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrderHistory;
