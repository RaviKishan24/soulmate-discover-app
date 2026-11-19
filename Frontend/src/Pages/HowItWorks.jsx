import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Flame, HeartHandshake, MessageCircle, ArrowLeft, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <UserPlus size={28} className="text-brand-purple" />,
      title: "Create an Account",
      desc: "Sign up with your email, verify your 6-digit OTP, and build your profile with your bio, city, and interests."
    },
    {
      icon: <Flame size={28} className="text-brand-pink" />,
      title: "Discover & Swipe",
      desc: "Browse profiles in the Discover tab. Swipe right to Like, or swipe left to Pass. Once you swipe on someone, they don't come back."
    },
    {
      icon: <HeartHandshake size={28} className="text-red-500" />,
      title: "Make a Mutual Match",
      desc: "If you like someone, and they also like you back, it's a Match! We keep your incoming likes strictly private until it's mutual."
    },
    {
      icon: <MessageCircle size={28} className="text-green-500" />,
      title: "Connect & Chat",
      desc: "When a match happens, you will get a real-time notification. Head to the Matches tab to see your connections."
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-130px)] bg-brand-soft pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-purple mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-brand-pink rounded-full text-xs font-bold mb-4">
            <Sparkles size={14} /> The SoulMate Process
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            How It Works
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Find your perfect match in 4 simple steps. Here is everything you need to know about how the app functions.
          </p>
        </div>

        {/* Responsive Grid: 1 column on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Background Number */}
              <span className="absolute -top-4 -right-2 text-7xl font-black text-gray-50 opacity-60 pointer-events-none group-hover:text-pink-50 transition-colors z-0">
                0{idx + 1}
              </span>

              <div className="relative z-10 w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
                {step.icon}
              </div>
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 md:mt-16 text-center">
          <Link 
            to="/discover"
            className="inline-flex items-center justify-center bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-base md:text-lg w-full md:w-auto"
          >
            Start Swiping Now
          </Link>
          <p className="text-xs text-gray-400 mt-4">
            Remember to be respectful. It's a small world!
          </p>
        </div>

      </div>
    </div>
  );
}