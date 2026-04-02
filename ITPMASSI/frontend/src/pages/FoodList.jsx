import { useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { api } from "../services/api";
import RequestForm from "../components/RequestForm";

const fallbackFoods = [
  { _id: "temp-1", name: "Chicken Kottu", price: 650, inStock: true, image: "https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=800&q=80" },
  { _id: "temp-2", name: "Veg Rice", price: 420, inStock: true, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80" },
  { _id: "temp-3", name: "Iced Coffee", price: 300, inStock: true, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80" },
];

const FoodList = ({ currentUser, nearbyUsers, onRequestCreated }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      const { data } = await api.get("/foods");
      setFoods(data);
    } catch (error) {
      // Fallback keeps the UI useful when backend is not ready yet.
      setFoods(fallbackFoods);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <p className="text-slate-500">Loading foods...</p> : null}
        {foods.map((food) => (
          <article
            key={food._id}
            className="panel-glass overflow-hidden transition duration-300 hover:-translate-y-1"
          >
            <img
              src={food.image}
              alt={food.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-900">{food.name}</h3>
                <span className="rounded-xl bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700 whitespace-nowrap">
                  LKR {food.price}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold rounded-xl px-3 py-1 ${
                    food.inStock
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {food.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <button 
                disabled={!food.inStock}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingBag />
                Request Food
              </button>
            </div>
          </article>
        ))}
      </section>

      <RequestForm
        foods={foods}
        currentUser={currentUser}
        nearbyUsers={nearbyUsers}
        onRequestCreated={onRequestCreated}
      />
    </div>
  );
};

export default FoodList;
