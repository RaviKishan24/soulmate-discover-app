import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("coyToken");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}