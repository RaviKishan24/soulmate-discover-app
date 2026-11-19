import { X, Heart } from "lucide-react";

export default function SwipeButtons({ onLike, onPass, disabled }) {
  return (
    <div className="flex justify-center gap-8 mt-6">
      <button
        onClick={onPass}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:scale-105 active:scale-95 transition disabled:opacity-50"
        aria-label="Pass"
      >
        <X size={30} />
      </button>
      <button
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple shadow-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition disabled:opacity-50"
        aria-label="Like"
      >
        <Heart size={30} fill="white" />
      </button>
    </div>
  );
}