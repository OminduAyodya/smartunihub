import { FiBell, FiSettings } from "react-icons/fi";

const AdminNavbar = ({ user, title }) => {
  return (
    <div className="bg-slate-950 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-slate-400 mt-1">Welcome back, {user.name} 👋</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
            <FiBell size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
            <FiSettings size={20} />
          </button>
          <div className="pl-4 border-l border-slate-800">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
