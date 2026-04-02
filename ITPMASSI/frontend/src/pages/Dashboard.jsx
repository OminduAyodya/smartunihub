import { useEffect } from "react";
import { FiArrowRight, FiCalendar, FiCoffee, FiStar, FiTrendingUp, FiUsers, FiAward } from "react-icons/fi";
import { Link } from "react-router-dom";

const Dashboard = ({ onUserLoaded }) => {
  useEffect(() => {
    onUserLoaded({ name: "Student", email: "student@smartunihub.com" });
  }, [onUserLoaded]);

  const features = [
    {
      id: 1,
      icon: <FiCoffee className="text-3xl" />,
      title: "Easy Ordering",
      description: "Browse and order food from multiple canteens with just a few clicks",
      color: "from-amber-50 to-orange-50"
    },
    {
      id: 2,
      icon: <FiCalendar className="text-3xl" />,
      title: "Event Planning",
      description: "Discover and plan amazing events happening around campus",
      color: "from-rose-50 to-pink-50"
    },
    {
      id: 3,
      icon: <FiUsers className="text-3xl" />,
      title: "Share & Connect",
      description: "Connect with friends and share experiences across campus",
      color: "from-blue-50 to-cyan-50"
    },
    {
      id: 4,
      icon: <FiAward className="text-3xl" />,
      title: "Earn Rewards",
      description: "Get exclusive perks and rewards for your participation",
      color: "from-purple-50 to-indigo-50"
    }
  ];

  const topCanteens = [
    {
      id: 1,
      name: "ANOHANA",
      items: 24,
      rating: 4.8,
      color: "from-emerald-500 to-green-600"
    },
    {
      id: 2,
      name: "Basement Canteen",
      items: 32,
      rating: 4.9,
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 3,
      name: "Main Hall Canteen",
      items: 18,
      rating: 4.7,
      color: "from-blue-500 to-cyan-600"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-16 text-white shadow-lg sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            Welcome to smartuniHub
          </h1>
          <p className="mt-4 text-lg opacity-90 sm:text-xl">
            Discover, book, and enjoy amazing food and events happening around your campus
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/canteen"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-600 transition hover:bg-gray-100"
            >
              Explore Canteen
              <FiArrowRight />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white px-6 py-3 font-bold transition hover:bg-white/10"
            >
              Browse Events
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-black text-black sm:text-4xl mb-12">Why Choose smartuniHub?</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`rounded-2xl border border-gray-200 bg-gradient-to-br ${feature.color} p-8 shadow-md transition hover:shadow-lg hover:border-gray-300`}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Canteens */}
      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-black text-black sm:text-4xl">Featured Canteens</h2>
          <Link to="/canteen" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topCanteens.map((canteen) => (
            <Link
              key={canteen.id}
              to="/canteen"
              className="group rounded-2xl border border-gray-200 bg-white shadow-md transition hover:shadow-xl overflow-hidden"
            >
              <div className={`h-24 bg-gradient-to-r ${canteen.color} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-white" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-black">{canteen.name}</h3>
                <div className="mt-4 flex items-center justify-between text-gray-600">
                  <span className="font-semibold">{canteen.items} Items</span>
                  <div className="flex items-center gap-1">
                    <FiStar className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-black">{canteen.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-black text-black sm:text-4xl">Upcoming Events</h2>
          <Link to="/events" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-md">
          <p className="text-gray-600 text-lg">No upcoming events available at the moment</p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-16 text-white shadow-lg">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl mb-4">Ready to Experience Campus Life?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of students enjoying seamless food ordering and event planning
          </p>
          <Link
            to="/canteen"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-purple-600 transition hover:bg-gray-100 duration-300"
          >
            Get Started Now
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
