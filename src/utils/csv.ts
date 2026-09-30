import { STATUS_LABEL, type Restaurant, type TrackingMap } from '../types'
const esc = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
export function toRows(list: Restaurant[], t: TrackingMap) {
  return list.map(r => ({
    name: r.name, phone: r.phoneRaw, normalizedPhone: r.phone ?? '', wilaya: r.wilaya, city: r.city,
    status: STATUS_LABEL[t[r.key]?.status ?? 'new'], contactDate: t[r.key]?.contactedAt ?? ''
  }))
}
export function toCsv(list: Restaurant[], t: TrackingMap): string {
  const head = ['Restaurant Name', 'Phone', 'Normalized Phone', 'Wilaya', 'City', 'Status', 'Contact Date']
  const rows = toRows(list, t).map(r => [r.name, r.phone, r.normalizedPhone, r.wilaya, r.city, r.status, r.contactDate].map(esc).join(','))
  return '\uFEFF' + [head.join(','), ...rows].join('\r\n')
}
export function download(filename: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime + ';charset=utf-8' }))
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
