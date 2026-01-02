const API = import.meta.env.VITE_API_URL || "";

export const authService = {
  login: async (email, password) => {
    console.log('[DEBUG] authService.login -> start', { email });
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log('[DEBUG] client login: status=', res.status, ' ok=', res.ok);
    // NIE możesz odczytać Set-Cookie z res.headers w przeglądarce - sprawdź Network -> Response headers -> Set-Cookie

    const data = await res.json().catch(() => null);
    console.log('[DEBUG] client login: body=', data);

    // dodatkowe sprawdzenia: 1) próbny request do /api/debug/cookies (jeśli masz endpoint debugowy)
    try {
      const dbg = await fetch(`${API}/api/debug/cookies`, { credentials: 'include' });
      console.log('[DEBUG] client /api/debug/cookies status=', dbg.status);
      const dbgBody = await dbg.json().catch(()=>null);
      console.log('[DEBUG] client /api/debug/cookies body=', dbgBody);
    } catch (e) {
      console.log('[DEBUG] client /api/debug/cookies error=', e);
    }

    // 2) sprawdź też /api/auth/me — jeśli zwróci usera, cookie są poprawnie przesyłane
    try {
      const meReq = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
      console.log('[DEBUG] client /api/auth/me status=', meReq.status);
      const meBody = await meReq.json().catch(()=>null);
      console.log('[DEBUG] client /api/auth/me body=', meBody);
    } catch (e) {
      console.log('[DEBUG] client /api/auth/me error=', e);
    }

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return data; // { user }
  },

  logout: async () => {
    console.log('[DEBUG] authService.logout -> start');
    try {
      const res = await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      console.log('[DEBUG] logout status=', res.status);
      return res.ok;
    } catch (e) {
      console.log('[DEBUG] logout error=', e);
      throw e;
    }
  },

  me: async () => {
    console.log('[DEBUG] authService.me -> start');
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        credentials: "include",
      });
      console.log('[DEBUG] authService.me status=', res.status);
      if (!res.ok) {
        return null;
      }
      const data = await res.json().catch(()=>null);
      console.log('[DEBUG] authService.me body=', data);
      return data?.user ?? null;
    } catch (e) {
      console.log('[DEBUG] authService.me error=', e);
      return null;
    }
  },
};