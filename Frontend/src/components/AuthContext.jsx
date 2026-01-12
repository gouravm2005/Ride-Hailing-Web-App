import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userAuth"));
    const storedCaptain = JSON.parse(localStorage.getItem("captainAuth"));

    if (storedUser) setAuth({ role: "user", ...storedUser });
    else if (storedCaptain) setAuth({ role: "captain", ...storedCaptain });
  }, []);

  const logout = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("captainAuth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
