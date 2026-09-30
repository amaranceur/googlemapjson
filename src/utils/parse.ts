import { normalizePhone } from './phone'
import type { Restaurant } from '../types'

const ALIASES = {
  name: ['name', 'restaurantname', 'restaurant', 'nom', 'title', 'businessname', 'displayname'],
  phone: ['phone', 'phonenumber', 'telephone', 'tel', 'mobile', 'whatsapp', 'gsm', 'numero', 'contact', 'formattedphonenumber', 'internationalphonenumber'],
  wilaya: ['wilaya', 'province', 'state', 'region'],
  city: ['commune', 'city', 'town', 'ville', 'locality', 'area', 'address']
}
const canon = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, '')
const str = (v: unknown): string => {
  if (v == null) return ''
  if (Array.isArray(v)) return v.map(str).filter(Boolean).join(' / ')
  if (typeof v === 'object') return ''
  return String(v).trim()
}
function pick(obj: Record<string, unknown>, names: string[]): string {
  const map = new Map<string, unknown>()
  for (const k of Object.keys(obj)) map.set(canon(k), obj[k])
  for (const n of names) { const s = str(map.get(n)); if (s) return s }
  return ''
}
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

/** Finds the array of records inside arbitrary JSON structures. */
export function findRecords(json: unknown): unknown[] {
  if (Array.isArray(json)) return json
  if (isObj(json)) {
    let best: unknown[] = []
    for (const v of Object.values(json)) {
      const found = Array.isArray(v) || isObj(v) ? findRecords(v) : []
      if (found.length > best.length) best = found
    }
    if (best.length) return best
    const vals = Object.values(json)
    if (vals.length && vals.every(isObj)) return vals
  }
  return []
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export function parseRestaurants(text: string): { restaurants: Restaurant[]; skipped: number } {
  let json: unknown
  try { json = JSON.parse(text.replace(/^\uFEFF/, '')) }
  catch (e) { throw new Error('This file is not valid JSON: ' + (e instanceof Error ? e.message : 'parse error')) }
  const records = findRecords(json)
  if (!records.length) throw new Error('No restaurant list found. Expected an array of objects.')
  let skipped = 0
  const restaurants: Restaurant[] = []
  records.forEach((rec, i) => {
    if (!isObj(rec)) { skipped++; return }
    try {
      const name = pick(rec, ALIASES.name)
      const phoneRaw = pick(rec, ALIASES.phone)
      const wilaya = pick(rec, ALIASES.wilaya)
      const city = pick(rec, ALIASES.city)
      const { phone, kind } = normalizePhone(phoneRaw)
      const key = phone ?? `n:${slug(name)}|${slug(wilaya)}|${slug(city)}`
      restaurants.push({ id: `r${i}`, key, name, phoneRaw, phone, phoneKind: kind, wilaya, city })
    } catch { skipped++ }
  })
  return { restaurants, skipped }
}
