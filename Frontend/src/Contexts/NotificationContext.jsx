import { createContext, useContext, useState, useEffect } from "react";
import { getMatches, markMatchesSeen } from "../Services/api";
import { useLocation } from "react-router-dom";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [unseenMatches, setUnseenMatches] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [latestMatch, setLatestMatch] = useState(null);
  
  const location = useLocation();
  const token = localStorage.getItem("coyToken");

  useEffect(() => {
    if (!token) return;

    const checkMatches = async () => {
      try {
        const data = await getMatches();
        
        if (data.matches) {
          // 1. Filter matches the backend says are unseen
          const newMatches = data.matches.filter(m => !m.isSeen);
          
          // 2. Check sessionStorage to see if we ALREADY showed a toast for this match
          const alertedIds = JSON.parse(sessionStorage.getItem("alertedMatches") || "[]");
          const brandNew = newMatches.find(m => !alertedIds.includes(m._id));

          if (brandNew) {
            // Save to sessionStorage so a refresh doesn't trigger it again
            const updatedAlerts = [...alertedIds, brandNew._id];
            sessionStorage.setItem("alertedMatches", JSON.stringify(updatedAlerts));

            setUnseenMatches(newMatches);
            setLatestMatch(brandNew);
            setShowToast(true);

            // 🔥 CRITICAL: Mark as seen in the DB immediately so the backend stops sending it
            await markMatchesSeen(); 
          } else if (newMatches.length > 0) {
             setUnseenMatches(newMatches);
          } else {
             setUnseenMatches([]);
          }
        }
      } catch (err) {
        console.error("Failed to check matches", err);
      }
    };

    checkMatches(); 
    const interval = setInterval(checkMatches, 10000); // Check every 10s
    return () => clearInterval(interval);
    
  }, [token, location.pathname]); 

  const clearNotifications = () => {
    setUnseenMatches([]);
    setShowToast(false);
    setLatestMatch(null);
  };

  return (
    <NotificationContext.Provider value={{ unseenMatches, showToast, latestMatch, setShowToast, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);