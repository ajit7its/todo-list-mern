import { createContext, useContext, useEffect, useState } from "react";
import { logoutUser } from "../services/authService";

// Create the Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setTokenState] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Save token to both state + localStorage
  const saveToken = (tokenValue) => {
    setTokenState(tokenValue);
    if (tokenValue) {
      localStorage.setItem("token", tokenValue);
    } else {
      localStorage.removeItem("token");
    }
  };

  // Login handler (called after successful login API)
  const login = (userData, tokenValue) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    saveToken(tokenValue);
  };

  // Logout handler (clears everything)
  const logout = () => {
    setUser(null);
    saveToken(null);
    logoutUser(); // already redirects to /login
  };

  // Sync Auth state with localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setTokenState(storedToken);
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        setLoading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy use
export const useAuth = () => useContext(AuthContext);
