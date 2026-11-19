import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, User, Settings, ChevronDown, AlertTriangle } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/matches", label: "Matches" }
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const dropdownRef = useRef(null);


  const token = localStorage.getItem("coyToken");
  const userRaw = localStorage.getItem("coyUser");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function confirmLogout() {
    localStorage.removeItem("coyToken");
    localStorage.removeItem("coyUser");
    setShowLogoutModal(false);
    navigate("/login");
  }


  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <>
      <header className="w-full px-4 py-3 md:px-6 flex items-center justify-between border-b border-pink-100 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        
 
        <NavLink to="/" className="text-xl md:text-2xl font-bold text-brand-purple tracking-tight flex items-center">
          SoulMate <span className="text-brand-pink ml-1">Discover</span>
        </NavLink>

  
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? "text-brand-pink" : "text-gray-500 hover:text-brand-purple"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

   
        <div className="relative" ref={dropdownRef}>
          {token && user ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-none group"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full cursor-pointer bg-gradient-to-br from-brand-purple to-brand-pink text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-transparent group-hover:ring-pink-200 transition-all overflow-hidden">
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full items-center justify-center ${
                      user?.photo ? "hidden" : "flex"
                    }`}
                  >
                    {getInitials(user?.name)}
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

       
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-1.5 z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                  
              
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                      {user?.photo ? (
                        <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>

              
                  <div className="py-1.5">
                    <button 
                      onClick={() => { setIsDropdownOpen(false); navigate("/profile"); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-purple flex items-center gap-3 transition-colors font-medium"
                    >
                      <User size={16} className="text-gray-400" /> My Profile
                    </button>
                    <button 
                      onClick={() => { setIsDropdownOpen(false); navigate("/settings"); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-purple flex items-center gap-3 transition-colors font-medium"
                    >
                      <Settings size={16} className="text-gray-400" /> Settings
                    </button>
                  </div>

          
                  <div className="border-t border-gray-100 pt-1.5">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false); 
                        setShowLogoutModal(true); 
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-semibold"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>

                </div>
              )}
            </>
          ) : (
            <NavLink 
              to="/login" 
              className="text-sm font-semibold bg-brand-pink text-white px-5 py-2 rounded-full hover:bg-brand-purple transition shadow-sm hover:shadow-md active:scale-95"
            >
              Login
            </NavLink>
          )}
        </div>
      </header>

    
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
       
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={28} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Log Out?</h2>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to log out of SoulMate? You'll need to log back in to continue swiping.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-full font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md shadow-red-200 transition-colors"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}