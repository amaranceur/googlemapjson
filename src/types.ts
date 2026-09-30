export type Status = 'new' | 'contacted' | 'interested' | 'not_interested' | 'follow_up'
export type PhoneKind = 'mobile' | 'landline' | 'international' | 'invalid'
export interface Restaurant {
  id: string; key: string; name: string; phoneRaw: string
  phone: string | null; phoneKind: PhoneKind; wilaya: string; city: string
}
export interface Tracking { status: Status; contactedAt?: string }
export type TrackingMap = Record<string, Tracking>
export const STATUS_LABEL: Record<Status, string> = {
  new: 'Not contacted', contacted: 'Contacted', interested: 'Interested',
  not_interested: 'Not interested', follow_up: 'Follow up'
}
export const STATUSES = Object.keys(STATUS_LABEL) as Status[]
export const canWhatsApp = (r: Restaurant) => r.phoneKind === 'mobile' || r.phoneKind === 'international'
