const Navbar = ({ user, title = "Dashboard", selectedCanteen }) => {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-semibold text-emerald-700">{selectedCanteen?.name}</span> • {selectedCanteen?.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
