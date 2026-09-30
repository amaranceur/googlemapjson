export function load<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fb } catch { return fb }
}
export function save(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage full or blocked */ } }
