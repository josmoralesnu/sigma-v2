// Sesión (JWT real). Rehidrata desde el token guardado; expone login/logout.
import { useEffect, useState } from "react";
import { adoptToken, brainApi, isAuthenticated, login as apiLogin, logout as apiLogout, type ApiUser } from "../lib/api";

export function useAuth() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // SSO desde AgenciaOS (SIGMA MADRE): ?access&refresh en la URL → adopta la sesión.
      const sp = new URLSearchParams(window.location.search);
      const ssoAccess = sp.get("access");
      if (ssoAccess) {
        adoptToken(ssoAccess, sp.get("refresh") ?? undefined);
        window.history.replaceState({}, "", window.location.pathname);
      }
      try {
        if (isAuthenticated()) setUser(await brainApi.me());
      } catch {
        apiLogout();
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    try {
      setUser(await apiLogin(username, password));
    } catch {
      setError("Credenciales inválidas");
      throw new Error("login");
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return { user, ready, error, login, logout };
}
