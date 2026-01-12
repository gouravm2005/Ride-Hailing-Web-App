import { Navigate } from "react-router-dom";

export default function CaptainPrivateRoute({ children }) {
  const auth = JSON.parse(localStorage.getItem("captainAuth"));
  if (!auth?.token) return <Navigate to="/CaptainLogin" />;
  return children;
}