const API = import.meta.env.VITE_API_URL || "";

export const authService = {
  login: async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });


    const data = await res.json().catch(() => null);

    try {
      const dbg = await fetch(`${API}/api/debug/cookies`, { credentials: 'include' });

      const dbgBody = await dbg.json().catch(()=>null);

    } catch (e) {
      console.log('[DEBUG] client /api/debug/cookies error=', e);
    }

    try {
      const meReq = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
      const meBody = await meReq.json().catch(()=>null);
    } catch (e) {
      console.log('[DEBUG] client /api/auth/me error=', e);
    }

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return data; // { user }
  },

  logout: async () => {
    try {
      const res = await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch (e) {
      console.log('[DEBUG] logout error=', e);
      throw e;
    }
  },

  me: async () => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) {
        return null;
      }
      const data = await res.json().catch(()=>null);
      return data?.user ?? null;
    } catch (e) {
      console.log('[DEBUG] authService.me error=', e);
      return null;
    }
  },
};