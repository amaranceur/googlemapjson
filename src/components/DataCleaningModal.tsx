import { X } from 'lucide-react'
import type { Restaurant } from '../types'
import { canWhatsApp } from '../types'
import { duplicateCounts } from '../utils/duplicates'
export function cleaningStats(list: Restaurant[]) {
  const c = duplicateCounts(list)
  const dupPhones = [...c.values()].filter(n => n > 1).length
  return {
    'Total records': list.length,
    'Valid phone numbers': list.filter(canWhatsApp).length,
    'Invalid phone numbers': list.filter(r => !canWhatsApp(r)).length,
    'Duplicate phone numbers': dupPhones,
    'Rows sharing a duplicate number': list.filter(r => r.phone && (c.get(r.phone) ?? 0) > 1).length,
    'Missing restaurant names': list.filter(r => !r.name).length,
    'Missing phone numbers': list.filter(r => !r.phoneRaw).length
  }
}
export default function DataCleaningModal({ list, onClose, inline }: { list: Restaurant[]; onClose?: () => void; inline?: boolean }) {
  const body = (
    <div className="card w-full max-w-md p-5" role="dialog" aria-label="Data cleaning report">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Data cleaning report</h2>
        {onClose && <button className="btn px-2" onClick={onClose} aria-label="Close"><X size={16} /></button>}
      </div>
      <dl className="divide-y divide-stone-200 text-sm dark:divide-stone-800">
        {Object.entries(cleaningStats(list)).map(([k, v]) => (
          <div key={k} className="flex justify-between py-2"><dt className="text-stone-600 dark:text-stone-400">{k}</dt><dd className="font-medium tabular-nums">{v}</dd></div>
        ))}
      </dl>
    </div>
  )
  if (inline) return body
  return <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4" onClick={onClose}><div onClick={e => e.stopPropagation()} className="w-full max-w-md">{body}</div></div>
}
