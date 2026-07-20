/**
 * Resolves the base URL for all API requests.
 *
 * Priority order:
 *  1. VITE_API_URL — set this when the frontend and API are on different
 *     domains (e.g. frontend on Vercel, API on Railway/Render).
 *  2. Same-origin fallback — works when both are served from the same host
 *     (Replit dev, Docker compose, etc.).
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ??
  import.meta.env.BASE_URL?.replace(/\/+$/, "") ??
  "";

/** Build an absolute API path, e.g. apiUrl("/users/login") */
export function apiUrl(path: string): string {
  const base = API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api${normalizedPath}`;
}
