import type { Restaurant } from '../types'
export function duplicateCounts(list: Restaurant[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const r of list) if (r.phone) m.set(r.phone, (m.get(r.phone) ?? 0) + 1)
  return m
}
export const isDuplicate = (r: Restaurant, c: Map<string, number>) => !!r.phone && (c.get(r.phone) ?? 0) > 1
