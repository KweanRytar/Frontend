// pages/ProtectedRouteFallback.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteFallback = () => {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  return loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRouteFallback;
