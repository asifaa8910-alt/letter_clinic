import React, { createContext, useState, useEffect, useCallback } from "react";
import { apiService } from "../services/apiService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => apiService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // Sync current user on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = apiService.getCurrentUser();
      const token = localStorage.getItem("token");

      if (token && storedUser) {
        try {
          const freshUser = await apiService.fetchCurrentUser();
          setUser(freshUser);
          localStorage.setItem("currentUser", JSON.stringify(freshUser));
        } catch (err) {
          console.warn("Session check failed, falling back to local cached profile:", err.message);
          if (err.status === 401) {
            await apiService.logout();
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError("");
    try {
      const loggedUser = await apiService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    }
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    setAuthError("");
    try {
      const newUser = await apiService.register(name, email, password, role);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setAuthError(err.message || "Registration failed");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await apiService.logout();
    setUser(null);
    setAuthError("");
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
  }, []);

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    updateUser,
    setAuthError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Re-export hook for convenience
export { useAuth } from "./useAuth";
