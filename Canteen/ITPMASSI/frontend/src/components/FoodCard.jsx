import { FiCoffee, FiTag } from "react-icons/fi";

const FoodCard = ({ food, onRequestClick }) => {
  const inStock = Number(food?.stock || 0) > 0;

  return (
    <article className="panel-glass group p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{food.name}</h3>
          <p className="mt-1 text-sm text-slate-500">Price: LKR {food.price}</p>
        </div>
        <span className="rounded-xl bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700">
          <FiCoffee className="inline-block" /> Food
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-slate-600">
          Stock: <span className={`font-semibold ${inStock ? "text-emerald-700" : "text-rose-700"}`}>{food.stock}</span>
        </p>
        <p className="text-amber-700">
          <FiTag className="mr-1 inline-block" /> {food.offer || "No offer"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRequestClick(food._id)}
        disabled={!inStock}
        className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Request Food
      </button>
    </article>
  );
};

export default FoodCard;