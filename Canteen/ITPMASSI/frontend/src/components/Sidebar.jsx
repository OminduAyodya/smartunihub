import { FiCoffee, FiGift, FiSend, FiList } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", icon: <FiCoffee />, to: "/canteen" },
  { label: "Food & Stock", icon: <FiList />, to: "/canteen/food-stock" },
  { label: "Offers", icon: <FiGift />, to: "/canteen/offers" },
  { label: "Requests", icon: <FiSend />, to: "/canteen/requests" },
];

const Sidebar = () => {
  return (
    <aside className="panel-glass h-full min-h-[calc(100vh-2rem)] w-full border border-slate-200/80 p-4 lg:w-64">
      <div className="mb-8 px-2 pt-2">
        <h1 className="text-xl font-extrabold text-slate-900">SmartUniHub</h1>
        <p className="text-sm text-slate-500">Canteen Portal</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-soft"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
