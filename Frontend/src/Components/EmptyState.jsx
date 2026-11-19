import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mb-6">
        <Sparkles size={40} className="text-brand-pink" />
      </div>
      <h2 className="text-2xl font-bold">You've seen everyone!</h2>
      <p className="text-gray-600 mt-2 max-w-xs">
        There are no more profiles to discover right now. Check your matches or come back later.
      </p>
      <button
        onClick={() => navigate("/matches")}
        className="mt-6 bg-brand-purple text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
      >
        View Matches
      </button>
    </div>
  );
}