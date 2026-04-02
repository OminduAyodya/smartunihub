const AdminCard = ({ title, value, subtitle, icon, color }) => {
  const colorMap = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    green: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    yellow: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    red: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    purple: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  };

  return (
    <div className={`panel-glass p-6 border ${colorMap[color] || colorMap.blue}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-300">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="text-3xl opacity-50">{icon}</div>
      </div>
    </div>
  );
};

export default AdminCard;
