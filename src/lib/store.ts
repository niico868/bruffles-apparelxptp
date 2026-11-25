// Tiny per-device memory for the demo (saves and "Request it back"). localStorage only, wrapped in
// try/catch: in a private window or with storage blocked, the buttons still work for the visit.
// Nothing is sent to a server. The live version swaps these for database calls.
export function readList(key: string): string[] {
  try { const v = JSON.parse(localStorage.getItem(key) ?? "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
export function writeList(key: string, list: string[]) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* storage blocked: keep going */ }
  window.dispatchEvent(new CustomEvent(`store:${key}`));
}
export function toggleIn(key: string, id: string, on: boolean) {
  const list = readList(key).filter((x) => x !== id);
  writeList(key, on ? [...list, id] : list);
}
