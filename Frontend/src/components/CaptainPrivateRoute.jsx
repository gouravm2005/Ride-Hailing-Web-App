import { Navigate } from "react-router-dom";

export default function CaptainPrivateRoute({ children }) {
  const auth = JSON.parse(sessionStorage.getItem("captainAuth"));
  if (!auth?.token) return <Navigate to="/CaptainLogin" />;
  return children;
}