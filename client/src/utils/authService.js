export const authService = {
  login: async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return res.json(); // { user }
  },

  logout: async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  },

  me: async () => {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.user;
  },
};
