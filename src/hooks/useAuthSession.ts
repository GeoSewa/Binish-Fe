import { useEffect, useState } from "react";
import { isTokenExpired, refreshAccessToken } from "../utils/tokenUtils";

export default function useAuthSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const access = localStorage.getItem("token");
    const refresh = localStorage.getItem("refresh_token");

    if (access && !isTokenExpired(access)) {
      setIsAuthenticated(true);
    } else if (refresh && !isTokenExpired(refresh)) {
      try {
        const data = await refreshAccessToken(refresh);
        if (data.access) {
          localStorage.setItem("token", data.access);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
        }
      } catch (e) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      }
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();

    // Listen for custom authChanged event
    const handleAuthChanged = () => {
      setLoading(true);
      checkAuth();
    };
    window.addEventListener("authChanged", handleAuthChanged);
    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
    };
  }, []);

  // Also listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "refresh_token" || e.key === "username") {
        setLoading(true);
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { isAuthenticated, loading };
} 