/**
 * Device Nicknames Store
 *
 * Stores custom user-defined nicknames for Terra devices, keyed by userId.
 * Backed by localStorage so names persist across page reloads.
 *
 * Example: { "abc-123": "Apple Alpha", "def-456": "Apple Iota" }
 */

const STORAGE_KEY = "terra_device_nicknames";

export function getAllNicknames(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function getNickname(userId: string): string | null {
  const all = getAllNicknames();
  return all[userId] ?? null;
}

export function setNickname(userId: string, nickname: string): void {
  const all = getAllNicknames();
  if (nickname.trim()) {
    all[userId] = nickname.trim();
  } else {
    delete all[userId];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteNickname(userId: string): void {
  const all = getAllNicknames();
  delete all[userId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/**
 * Returns the display label for a device.
 * Falls back to the provider name if no nickname is set.
 */
export function getDeviceLabel(userId: string, provider: string): string {
  return getNickname(userId) ?? provider;
}
