import { FiBell, FiCoffee, FiGift, FiSend, FiList, FiChevronDown } from "react-icons/fi";
import { useCanteen } from "../context/CanteenContext";
import { useState, useMemo } from "react";

const TopNavigation = ({ user, selectedCanteen }) => {
  const [canteenDropdownOpen, setCanteenDropdownOpen] = useState(false);
  const [canteenSelected, setCanteenSelected] = useState(() => {
    // Check if user has explicitly selected a canteen before
    return localStorage.getItem("canteenExplicitlySelected") === "true";
  });
  const { setSelectedCanteen, canteens } = useCanteen();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "S";

  // Generate dynamic paths based on selected canteen
  const getCanteenPath = (route) => {
    if (selectedCanteen?.name === "ANOHANA") {
      return `/anohana${route}`;
    } else if (selectedCanteen?.name === "Basement Canteen") {
      return `/basement${route}`;
    }
    return `/canteen${route}`;
  };

  const navItems = useMemo(() => [
    { label: "Home", icon: <FiCoffee />, to: "/canteen" },
    { label: "Food & Stock", icon: <FiList />, to: getCanteenPath("/food-stock") },
    { label: "Offers", icon: <FiGift />, to: getCanteenPath("/offers") },
    { label: "Requests", icon: <FiSend />, to: getCanteenPath("/requests") },
  ], [selectedCanteen]);

  const handleSelectCanteen = (canteen) => {
    setSelectedCanteen(canteen);
    setCanteenSelected(true);
    localStorage.setItem("canteenExplicitlySelected", "true");
    setCanteenDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="px-4 lg:px-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 py-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
              S
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">SmartUniHub</h1>
              <p className="text-xs text-slate-500">Canteen Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          {!canteenSelected ? (
            <div className="hidden items-center gap-2 md:flex">
              <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
                ⚠ Please choose a canteen first
              </div>
            </div>
          ) : (
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.to}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right Section: Canteen Selector + User */}
          <div className="flex items-center gap-3">
            {/* Canteen Selector */}
            <div className="relative">
              <button
                onClick={() => setCanteenDropdownOpen(!canteenDropdownOpen)}
                className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition ${
                  canteenSelected
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                <FiCoffee />
                <span className="hidden sm:inline">
                  {canteenSelected ? selectedCanteen?.name : "Select Canteen"}
                </span>
                <FiChevronDown className={`transition ${canteenDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {canteenDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg">
                  {canteens.map((canteen) => (
                    <button
                      key={canteen.id}
                      onClick={() => handleSelectCanteen(canteen)}
                      className={`w-full px-4 py-3 text-left text-sm font-semibold transition ${
                        selectedCanteen?.id === canteen.id
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-bold">{canteen.name}</div>
                      <div className="text-xs text-slate-500">{canteen.location}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Button */}
            <button
              className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
              aria-label="Notifications"
            >
              <FiBell />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 font-bold text-white text-sm">
                {initial}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-900">{user?.name || "Student"}</p>
                <p className="text-xs text-slate-500">{user?.email || "student@smartunihub.com"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {!canteenSelected ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 flex items-center gap-2 md:hidden">
            ⚠ Please choose a canteen first
          </div>
        ) : (
          <nav className="flex gap-1 overflow-x-auto pb-2 md:hidden">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.to}
                className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default TopNavigation;
