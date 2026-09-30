import type { PhoneKind } from '../types'
export interface PhoneResult { phone: string | null; kind: PhoneKind }
const BAD: PhoneResult = { phone: null, kind: 'invalid' }

function classifyDz(rest: string): PhoneResult {
  if (rest.length === 9 && /^[567]/.test(rest)) return { phone: '+213' + rest, kind: 'mobile' }
  if (rest.length === 8 && /^[234]/.test(rest)) return { phone: '+213' + rest, kind: 'landline' }
  return BAD
}

function one(input: string): PhoneResult {
  const t = input.trim()
  let d = t.replace(/\D/g, '')
  if (!d) return BAD
  let intl = t.startsWith('+')
  if (!intl && d.startsWith('00')) { d = d.slice(2); intl = true }
  if (intl || (d.startsWith('213') && d.length >= 12)) {
    if (d.startsWith('213')) {
      let rest = d.slice(3)
      if (rest.startsWith('0')) rest = rest.slice(1) // +213 (0)555...
      return classifyDz(rest)
    }
    return d.length >= 8 && d.length <= 15 && d[0] !== '0' ? { phone: '+' + d, kind: 'international' } : BAD
  }
  if (d.startsWith('0')) return classifyDz(d.slice(1))
  if (d.length === 9 && /^[567]/.test(d)) return classifyDz(d) // leading 0 dropped
  return BAD
}

/** Accepts messy input; several numbers may be separated by / , ; | — the best one wins. */
export function normalizePhone(raw: unknown): PhoneResult {
  if (raw == null) return BAD
  const s = Array.isArray(raw) ? raw.join('/') : String(raw)
  let landline: PhoneResult | null = null
  for (const part of s.split(/[\/;,|]|\bou\b|\bor\b/i)) {
    const r = one(part)
    if (r.kind === 'mobile' || r.kind === 'international') return r
    if (r.kind === 'landline' && !landline) landline = r
  }
  return landline ?? BAD
}
