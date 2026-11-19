import { Link } from "react-router-dom";
import { Flame, Heart, Shield, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const userRaw = localStorage.getItem("coyUser");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="w-full max-w-lg md:max-w-4xl mx-auto px-5 py-8 flex flex-col gap-8 pb-24 md:pb-10">
      

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-purple to-brand-pink rounded-3xl p-6 md:p-10 text-white shadow-xl shadow-pink-200/50">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl" />

        <div className="relative z-10 md:flex md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-4">
              <Sparkles size={14} /> Welcome to SoulMate Discover
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2">
              Hey {firstName}, <br className="md:hidden" />
              <span className="hidden md:inline"> ready to find your match?</span>
              <span className="md:hidden">ready to find <br />your match?</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-6 max-w-[280px] md:max-w-md">
              Discover new people, make genuine connections, and see where it goes.
            </p>
            
            <Link
              to="/discover"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-purple font-bold px-6 py-3 md:px-8 md:py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              Start Swiping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Your Activity</h2>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          
          <Link
            to="/discover"
            className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-3">
              <Flame size={20} className="md:w-6 md:h-6" fill="currentColor" />
            </div>
            <h3 className="font-bold text-gray-800 md:text-lg">Discover</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Find new profiles</p>
          </Link>

    
          <Link
            to="/matches"
            className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-100 flex items-center justify-center text-brand-pink mb-3">
              <Heart size={20} className="md:w-6 md:h-6" fill="currentColor" />
            </div>
            <h3 className="font-bold text-gray-800 md:text-lg">Matches</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">See mutual likes</p>
          </Link>

        </div>
      </section>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
   
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4">
            <Shield size={24} fill="currentColor" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Your privacy is safe</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
            We never reveal who liked you. A connection is only made when the feeling is mutual. It's the Coy promise.
          </p>
        </section>

   
        <section className="bg-pink-50 p-6 rounded-3xl border border-pink-100 relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10 flex gap-4 items-center">
            <div className="text-3xl md:text-4xl">💡</div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-brand-purple">Tip of the day</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Profiles with a detailed bio and shared interests get 3x more matches!
              </p>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}