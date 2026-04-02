import { FiHome, FiBox, FiGift, FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <FiHome />, href: "/admin/dashboard" },
    { label: "Food Management", icon: <FiBox />, href: "/admin/foods" },
    { label: "Offer Management", icon: <FiGift />, href: "/admin/offers" },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-extrabold text-white">
          Canteen<span className="text-amber-500">Admin</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">SmartUniHub Canteen</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.href
                ? "bg-brand-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <FiLogOut />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
