const Card = ({ title, value, subtitle, icon, iconColor = "text-brand-700 bg-brand-100" }) => {
  return (
    <div className="panel-glass p-5 transition-transform duration-200 hover:-translate-y-1 animate-rise">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-1 text-2xl font-extrabold text-slate-900">{value}</h3>
          {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <div className={`rounded-xl p-3 ${iconColor}`}>{icon}</div>
      </div>
    </div>
  );
};

export default Card;
