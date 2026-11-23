export interface UserSession {
  id?: string;
  name?: string;
  email: string;
  phone?: string | null;
  role: "USER" | "ADMIN" | string;
  createdAt?: string;
}

export const AUTH_STORAGE_KEY = "sbm_user";
export const AUTH_EVENT = "sbm-auth-change";

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: user }));
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: null }));
}
