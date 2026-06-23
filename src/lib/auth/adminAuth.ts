export const ADMIN_AUTH_KEY = "ez_admin_auth";

export type AdminAuthData = {
  token: string;
  username: string;
};

export function saveAdminAuth(data: AdminAuthData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(data));
}

export function getAdminAuth(): AdminAuthData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ADMIN_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminAuthData;
  } catch {
    return null;
  }
}

export function clearAdminAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_AUTH_KEY);
}

export function getAdminToken(): string | null {
  return getAdminAuth()?.token ?? null;
}
