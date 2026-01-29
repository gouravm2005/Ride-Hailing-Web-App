import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("userAuth"));
    const storedCaptain = JSON.parse(sessionStorage.getItem("captainAuth"));

    if (storedUser) setAuth({ role: "user", ...storedUser });
    else if (storedCaptain) setAuth({ role: "captain", ...storedCaptain });
  }, []);

  const logout = () => {
    sessionStorage.removeItem("userAuth");
    sessionStorage.removeItem("captainAuth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
