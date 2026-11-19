import { NavLink } from "react-router-dom";
import { Home, Flame, Heart } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Flame },
  { to: "/matches", label: "Matches", icon: Heart }
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-pink-100 flex justify-around py-2 z-20 md:static md:border-t-0 md:border-b md:justify-start md:gap-6 md:px-6">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center text-xs gap-1 px-3 py-1 rounded-lg transition ${
              isActive ? "text-brand-pink" : "text-gray-500 hover:text-brand-purple"
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}