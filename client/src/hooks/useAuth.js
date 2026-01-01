import { useEffect, useState } from "react";
import { authService } from "../utils/authService.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
  };
}
