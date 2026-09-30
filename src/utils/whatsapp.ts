import type { Restaurant } from '../types'
export const DEFAULT_MESSAGE = 'Bonjour {{name}}, je vous contacte car nous proposons une solution de gestion pour restaurants. Elle permet de gérer les commandes, les tables, le stock et les paiements depuis une seule application. Seriez-vous intéressé pour en savoir plus ?'
export function fillTemplate(t: string, r: Restaurant): string {
  const v: Record<string, string> = { name: r.name || '', wilaya: r.wilaya || '' }
  return t.replace(/\{\{\s*(name|wilaya)\s*\}\}/gi, (_, k: string) => v[k.toLowerCase()]).replace(/[ ]{2,}/g, ' ')
}
export const whatsappUrl = (phone: string, msg: string) => `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`
export function openWhatsApp(r: Restaurant, template: string): boolean {
  if (!r.phone) return false
  window.open(whatsappUrl(r.phone, fillTemplate(template, r)), '_blank', 'noopener')
  return true
}
