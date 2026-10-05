import { createContext } from "react";
import type { CurrentUser } from "./Authentication.tsx";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
