import { api } from "../services/api";

const statusColor = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-sky-100 text-sky-700",
  Rejected: "bg-rose-100 text-rose-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const RequestList = ({ currentUser, requests, onStatusChange }) => {
  const incoming = requests.filter((req) => req.receiver?._id === currentUser?._id);
  const outgoing = requests.filter((req) => req.sender?._id === currentUser?._id);

  const handleAction = async (id, action) => {
    try {
      const { data } = await api.put(`/request/${id}/${action}`);
      onStatusChange(data);
    } catch (error) {
      alert(error?.response?.data?.message || `Failed to ${action} request`);
    }
  };

  const renderTable = (title, list, type) => (
    <section className="panel-glass p-5">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="pb-2">Item</th>
              <th className="pb-2">Student</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Charge</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-3 text-slate-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              list.map((request) => (
                <tr key={request._id} className="border-t border-slate-100">
                  <td className="py-2">{request.items?.[0]?.foodItem?.name || "Food item"}</td>
                  <td className="py-2">
                    {type === "incoming" ? request.sender?.name : request.receiver?.name}
                  </td>
                  <td className="py-2">
                    <span className={`rounded-xl px-2 py-1 text-xs font-semibold ${statusColor[request.status]}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-2">LKR {request.serviceCharge}</td>
                  <td className="py-2">
                    {type === "incoming" && request.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(request._id, "accept")}
                          className="rounded-lg bg-sky-600 px-2 py-1 text-xs font-semibold text-white"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(request._id, "reject")}
                          className="rounded-lg bg-rose-600 px-2 py-1 text-xs font-semibold text-white"
                        >
                          Reject
                        </button>
                      </div>
                    ) : null}

                    {type === "outgoing" && request.status === "Accepted" ? (
                      <button
                        onClick={() => handleAction(request._id, "complete")}
                        className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
                      >
                        Complete
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="space-y-5">
      {renderTable("Incoming Requests", incoming, "incoming")}
      {renderTable("Outgoing Requests", outgoing, "outgoing")}
    </div>
  );
};

export default RequestList;
