import { useEffect, useState } from "react";
import { getFeed, postSwipe } from "../services/api";
import ProfileCard from "../Components/ProfileCard";
import EmptyState from "../Components/EmptyState";
import MatchModal from "../Components/MatchModal";
import { X, Heart } from "lucide-react";

export default function Discover() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getFeed();
        if (!cancelled) setProfiles(data.profiles || []);
      } catch (err) {
        if (!cancelled) setError("Failed to load feed.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleSwipe(action) {
    if (submitting || profiles.length === 0) return;
    const current = profiles[0];
    setSubmitting(true);
    setProfiles(p => p.slice(1)); 
    try {
      const res = await postSwipe(current._id, action);
      if (res.isMatch && res.match) setMatchData(res.match);
    } catch (err) {
      setError(err.response?.data?.message || "Swipe failed.");
      setProfiles(p => [current, ...p]);
    } finally {
      setSubmitting(false);
    }
  }

  return (

    <div className="w-full h-[calc(100dvh-130px)] flex flex-col overflow-hidden relative">
      
      {error && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm z-50 shadow-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-brand-pink rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-4 text-sm font-medium">Finding people...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center w-full">
          <EmptyState />
        </div>
      ) : (
       
        <div className="w-full max-w-md mx-auto h-full flex flex-col justify-between px-4 py-2">
     
          <div className="flex-1 w-full flex items-center justify-center min-h-0">
            <ProfileCard
              key={profiles[0]._id}
              profile={profiles[0]}
              onSwipe={handleSwipe}
              disabled={submitting}
            />
          </div>

        
          <div className="flex justify-center gap-6 mt-3 mb-4 shrink-0">
            <button
              onClick={() => handleSwipe("pass")}
              disabled={submitting}
              className="w-[60px] h-[60px] bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center text-gray-400 hover:text-red-500 active:scale-95 transition-all border border-gray-100"
            >
              <X size={28} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => handleSwipe("like")}
              disabled={submitting}
              className="w-[60px] h-[60px] bg-gradient-to-br from-brand-pink to-brand-purple rounded-full shadow-[0_8px_25px_rgba(236,72,153,0.35)] flex items-center justify-center text-white active:scale-95 transition-all"
            >
              <Heart size={28} strokeWidth={2.5} fill="currentColor" />
            </button>
          </div>
          
        </div>
      )}

      <MatchModal
        open={!!matchData}
        match={matchData}
        onClose={() => setMatchData(null)}
      />
    </div>
  );
}