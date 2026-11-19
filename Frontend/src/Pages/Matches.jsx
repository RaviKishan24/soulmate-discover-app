import { useEffect, useState } from "react";
import { getMatches } from "../services/api";
import { Heart, MessageCircle, X, ShieldCheck } from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMatches();
        setMatches(data.matches || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-pink-200 border-t-brand-pink rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Your Matches</h2>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-4">
            <Heart size={32} className="text-brand-pink" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No matches yet</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-[280px]">
            Keep swiping! When you and someone else like each other, they'll show up here.
          </p>
        </div>
      ) : (
       
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <button
              key={m._id}
              onClick={() => setSelectedMatch(m)}
              className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md hover:border-pink-200 transition-all text-left w-full group"
            >
              <img
                src={m.user.photo}
                alt={m.user.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex flex-col justify-center">
                <p className="font-bold text-gray-900 truncate md:text-lg">
                  {m.user.name}, <span className="text-gray-500 font-normal">{m.user.age}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-green-500" /> Matched
                </p>
                <p className="text-sm text-brand-purple mt-2 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  <MessageCircle size={14} /> Say hi!
                </p>
              </div>
            </button>
          ))}
        </div>
      )}


      {selectedMatch && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedMatch(null)} // Close when clicking backdrop
        >
         
          <div 
            className="bg-white w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300 flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            
      
            <div className="relative h-64 sm:h-72 w-full bg-gray-200 shrink-0">
              <img
                src={selectedMatch.user.photo}
                alt={selectedMatch.user.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
           
              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h2 className="text-3xl font-bold flex items-baseline gap-2">
                  {selectedMatch.user.name} <span className="text-xl font-normal opacity-90">{selectedMatch.user.age}</span>
                </h2>
                <p className="text-sm font-medium opacity-90 mt-1 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {selectedMatch.user.city}
                </p>
              </div>
            </div>

        
            <div className="p-5 md:p-6 flex-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
                {selectedMatch.user.bio}
              </p>
              
    
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedMatch.user.interests?.map((tag) => (
                  <span key={tag} className="text-xs md:text-sm font-medium bg-pink-50 text-brand-pink border border-pink-100 px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

           
              <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Keep your conversations on SoulMate. Do not share personal contact info immediately.
                </p>
                <button
                  onClick={() => alert("Chat feature coming soon!")}
                  className="w-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold py-3.5 rounded-full shadow-md hover:opacity-90 active:scale-95 transition-all text-sm md:text-base"
                >
                  Send a Message
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}