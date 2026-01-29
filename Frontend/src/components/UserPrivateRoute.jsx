import { Navigate } from "react-router-dom";

export default function UserPrivateRoute({ children }) {
  const auth = JSON.parse(sessionStorage.getItem("userAuth"));
  if (!auth?.token) return <Navigate to="/UserLogin" />;
  return children;
}
