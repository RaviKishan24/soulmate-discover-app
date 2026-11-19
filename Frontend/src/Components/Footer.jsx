import { NavLink } from "react-router-dom";
import { Home, Flame, Heart, HelpCircleIcon } from "lucide-react";

const mobileLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Flame },
  { to: "/matches", label: "Matches", icon: Heart },
    { to: "/how-it-works", label: "How it Works",icon:HelpCircleIcon },
];

export default function Footer() {
  return (
    <>
      
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-pink-100 flex justify-around py-2 z-20 safe-bottom">
        {mobileLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex flex-col items-center text-xs gap-1 px-3 py-1 rounded-lg transition ${
                isActive ? "text-brand-pink" : "text-gray-500"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>

      <footer className="hidden md:block w-full bg-white border-t border-pink-100 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Coy Discover. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-brand-purple">Privacy</a>
            <a href="#" className="hover:text-brand-purple">Terms</a>
            <a href="#" className="hover:text-brand-purple">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}