import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNotifications } from "../Contexts/NotificationContext";

export default function Layout({ children }) {
  const location = useLocation();

  const { showToast, latestMatch, setShowToast, clearNotifications } = useNotifications();


  const isAuthPage = ["/login", "/register", "/verify-otp"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-brand-soft relative">
      
      {!isAuthPage && <Navbar />}
      
      <main className={`flex-1 ${!isAuthPage ? "pb-20 md:pb-0" : ""}`}>
        {children}
      </main>

      {!isAuthPage && <Footer />}

    
      {showToast && latestMatch && (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[100] animate-in slide-in-from-right-8 fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] p-4 flex items-center gap-4 border border-pink-100 max-w-sm">
            <img 
              src={latestMatch.user.photo} 
              alt="Match" 
              className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-pink"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">It's a Match! 🎉</p>
              <p className="text-xs text-gray-500 mt-0.5">
                You and <span className="font-semibold text-brand-purple">{latestMatch.user.name}</span> liked each other.
              </p>
              <Link 
                to="/matches" 
                onClick={clearNotifications}
                className="text-xs font-bold text-brand-pink mt-1 inline-block hover:underline"
              >
                See Match
              </Link>
            </div>
            <button 
              onClick={() => setShowToast(false)} 
              className="ml-auto text-gray-400 hover:text-gray-600 p-1 self-start mt-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}