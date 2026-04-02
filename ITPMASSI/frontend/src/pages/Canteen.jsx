import { FiArrowRight, FiCoffee, FiShoppingCart, FiTag, FiTruck, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCanteen } from "../context/CanteenContext";

const Canteen = () => {
  const { selectedCanteen, setSelectedCanteen, canteens } = useCanteen();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine dynamic path based on selected canteen
  const getCanteenPath = (route) => {
    if (selectedCanteen?.name === "ANOHANA") {
      return `/anohana${route}`;
    } else if (selectedCanteen?.name === "Basement Canteen") {
      return `/basement${route}`;
    }
    return `/canteen${route}`;
  };

  const features = [
    { 
      icon: <FiShoppingCart className="text-3xl" />, 
      title: "View Food Items", 
      desc: "Browse fresh items with real-time stock availability",
      color: "from-emerald-50 to-green-50"
    },
    { 
      icon: <FiTag className="text-3xl" />, 
      title: "Special Offers", 
      desc: "Check current promotions and exclusive discounts",
      color: "from-amber-50 to-orange-50"
    },
    { 
      icon: <FiCoffee className="text-3xl" />, 
      title: "Request Food", 
      desc: "Request items for delivery from nearby friends",
      color: "from-rose-50 to-pink-50"
    },
    { 
      icon: <FiCheckCircle className="text-3xl" />, 
      title: "Approve/Reject", 
      desc: "Manage incoming food requests effortlessly",
      color: "from-blue-50 to-cyan-50"
    },
    { 
      icon: <FiTruck className="text-3xl" />, 
      title: "Track Orders", 
      desc: "Monitor real-time delivery status and updates",
      color: "from-purple-50 to-indigo-50"
    },
    { 
      icon: <FiCheckCircle className="text-3xl" />, 
      title: "Billing & Charges", 
      desc: "View detailed cost breakdown and payment summary",
      color: "from-cyan-50 to-blue-50"
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-16 text-white shadow-lg sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <FiCoffee className="text-3xl" />
            <span className="text-lg font-semibold opacity-90">Campus Canteen</span>
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            Discover Delicious Meals
          </h1>
          <p className="mt-4 text-lg opacity-90 sm:text-xl">
            Order fresh food from your favorite canteen and get it delivered instantly
          </p>
        </div>
      </section>

      {/* Canteen Selector */}
      <section>
        <h2 className="text-3xl font-black text-black mb-8">Select Your Canteen</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {canteens.map((canteen) => (
            <button
              key={canteen.id}
              onClick={() => setSelectedCanteen(canteen)}
              className={`rounded-2xl border-2 p-6 text-left transition transform hover:shadow-lg ${
                selectedCanteen?.id === canteen.id
                  ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-300 shadow-md"
              }`}
            >
              <div className="relative z-10">
                <div className="mb-2 text-3xl font-black text-black">{canteen.name}</div>
                <p className="text-gray-600 font-medium">{canteen.location}</p>
              </div>
              {selectedCanteen?.id === canteen.id && (
                <div className="absolute right-4 top-4 h-6 w-6 rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Main Actions Banner */}
      <section className="relative overflow-hidden rounded-3xl shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1800&q=80"
          alt="Food ordering service"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-900/50" />
        
        <div className="relative px-8 py-16 sm:py-20">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-black text-white sm:text-4xl mb-4">
              Manage Your Orders
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Access everything you need for {selectedCanteen?.name} food ordering and delivery
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to={getCanteenPath("/food-stock")}
                className="group relative overflow-hidden rounded-2xl border border-emerald-400 bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-4 font-bold text-white transition hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-lg">View Food & Stock</span>
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                to={getCanteenPath("/offers")}
                className="group relative overflow-hidden rounded-2xl border border-amber-400 bg-gradient-to-br from-amber-400 to-amber-500 px-6 py-4 font-bold text-slate-900 transition hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-lg">Current Offers</span>
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                to={getCanteenPath("/requests")}
                className="group relative overflow-hidden rounded-2xl border border-blue-400 bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-4 font-bold text-white transition hover:shadow-xl hover:-translate-y-1 sm:col-span-2"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-lg">Food Requests & Tracking</span>
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-black text-black mb-12">What You Can Do</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl border border-gray-200 bg-gradient-to-br ${feature.color} p-8 shadow-md transition hover:shadow-lg hover:border-gray-300`}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black shadow-sm">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-black mb-2">{feature.title}</h4>
              <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-16 text-white shadow-lg">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl mb-4">Ready to Order?</h2>
          <p className="text-lg opacity-90 mb-8">
            Start browsing delicious food options from {selectedCanteen?.name} now
          </p>
          <Link
            to={getCanteenPath("/food-stock")}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-orange-600 transition hover:bg-gray-100 duration-300"
          >
            Start Browsing
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Canteen;
