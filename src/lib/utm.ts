import type { Utm } from "@/types/api";
export function captureUtm(): Utm {
  if (typeof window === "undefined") return {};
  try {
    const saved = JSON.parse(localStorage.getItem("bm_utm") || "null");
    if (saved && saved.expiresAt > Date.now()) return saved.value;
    const query = new URLSearchParams(location.search);
    const value: Utm = {};
    for (const key of ["source", "medium", "campaign"] as const) {
      const text = query.get(`utm_${key}`);
      if (text) value[key] = text.slice(0, 200);
    }
    if (Object.keys(value).length)
      localStorage.setItem(
        "bm_utm",
        JSON.stringify({ value, expiresAt: Date.now() + 30 * 86400000 }),
      );
    return value;
  } catch {
    return {};
  }
}
