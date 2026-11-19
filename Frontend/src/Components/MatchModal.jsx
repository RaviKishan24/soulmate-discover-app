import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function MatchModal({ open, match, onClose }) {
  const navigate = useNavigate();
  if (!match) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 text-center max-w-sm w-full"
          >
            <h2 className="text-3xl font-black bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
              IT'S A MATCH!
            </h2>
            <p className="text-gray-600 mt-2">You and {match.user.name} liked each other.</p>
            <img
              src={match.user.photo}
              alt={match.user.name}
              className="w-32 h-32 rounded-full object-cover mx-auto mt-6 ring-4 ring-pink-200"
            />
            <p className="mt-3 font-semibold">{match.user.name}</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-200 py-3 rounded-full font-medium hover:bg-gray-50"
              >
                Keep swiping
              </button>
              <button
                onClick={() => { onClose(); navigate("/matches"); }}
                className="flex-1 bg-brand-purple text-white py-3 rounded-full font-semibold hover:opacity-90"
              >
                View Matches
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}