import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { CaptainDataContext } from "../context/CaptainContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  const { user, setUser } = useContext(UserDataContext);
  const { captain, setCaptain } = useContext(CaptainDataContext);

  if (!userAuth?.role || !captainAuth?.role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userAuth.role)||allowedRoles && !allowedRoles.includes(captainAuth.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
