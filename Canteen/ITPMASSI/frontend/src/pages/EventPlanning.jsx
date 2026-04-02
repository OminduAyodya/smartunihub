import { FiCalendar, FiCheckSquare, FiClock, FiGrid, FiImage, FiLayers, FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import EventActorSelector from "../components/events/EventActorSelector";
import { useEventActor } from "./events/useEventActor";

const actions = [
  {
    title: "Create Event",
    description: "Create a new event draft and submit it for approval.",
    to: "/events/create",
    icon: <FiPlusCircle className="text-brand-600" />,
  },
  {
    title: "Request Stalls",
    description: "Send or update stall requests for your events.",
    to: "/events/request-stalls",
    icon: <FiCheckSquare className="text-sky-600" />,
  },
  {
    title: "Stall Allocation Details",
    description: "View allocated stall IDs, location, and admin notes.",
    to: "/events/stall-allocation",
    icon: <FiLayers className="text-emerald-600" />,
  },
  {
    title: "Approve or Reject Events (Admin)",
    description: "Admin review panel to approve or reject pending events.",
    to: "/events/admin-review",
    icon: <FiGrid className="text-rose-600" />,
  },
  {
    title: "View Past Event Details",
    description: "Browse previous events with notes and status.",
    to: "/events/past",
    icon: <FiClock className="text-amber-600" />,
  },
  {
    title: "View Event Photo Gallery",
    description: "View photos and manage uploads or deletions.",
    to: "/events/gallery",
    icon: <FiImage className="text-indigo-600" />,
  },
  {
    title: "View Approved Event Calendar",
    description: "See approved upcoming events grouped by date.",
    to: "/events/calendar",
    icon: <FiCalendar className="text-teal-600" />,
  },
];

const EventPlanning = () => {
  const { users, currentUserId, setCurrentUserId, loadingUsers } = useEventActor();

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <section className="panel-glass p-5">
        <h2 className="text-2xl font-extrabold text-slate-900">Event Planning Hub</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your events, stalls, and approvals from one central location.
        </p>
      </section>

      {/* Info Alert Banner */}
      <section className="panel-glass border-l-4 border-blue-500 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          ℹ️ Select an event organizer below to view relevant tasks and manage event-related activities.
        </p>
      </section>

      {/* User Selector Section */}
      <section className="panel-glass p-5">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Event Organizer Selection</h3>
        <EventActorSelector
          users={users}
          currentUserId={currentUserId}
          onChange={setCurrentUserId}
          loading={loadingUsers}
        />
      </section>

      {/* Available Actions Grid */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">Available Tasks</h3>
          <p className="text-sm text-slate-600">Click on any task to open its dedicated page.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="panel-glass group block p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                {action.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700">{action.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventPlanning;
