import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext, type LoginCredentials } from "./AuthContext.ts";
import type { CurrentUser } from "./Authentication.tsx";

const AUTH_API_URL = "http://localhost:8080/api/auth";

async function requestCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
  const response = await fetch(`${AUTH_API_URL}/me`, {
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error("No authenticated user");
  }

  return response.json() as Promise<CurrentUser>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    requestCurrentUser(controller.signal)
      .then(setUser)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    const currentUser = await requestCurrentUser();
    setUser(currentUser);
  }, []);

  const logout = useCallback(async () => {
    const response = await fetch(`${AUTH_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Could not log out");
    }

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
