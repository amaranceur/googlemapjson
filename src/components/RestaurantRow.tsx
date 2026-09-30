import { Copy, MessageCircle } from 'lucide-react'
import { STATUSES, STATUS_LABEL, canWhatsApp, type Restaurant, type Status, type Tracking } from '../types'
import StatusBadge from './StatusBadge'

interface P { r: Restaurant; t?: Tracking; dup: boolean; selected: boolean; onSelect: () => void; onStatus: (s: Status) => void; onContact: () => void }
export default function RestaurantRow({ r, t, dup, selected, onSelect, onStatus, onContact }: P) {
  const status = t?.status ?? 'new'
  const ok = canWhatsApp(r)
  return (
    <tr className="border-t border-stone-200 dark:border-stone-800">
      <td className="w-10 px-3 py-3"><input type="checkbox" aria-label={`Select ${r.name}`} checked={selected} onChange={onSelect} /></td>
      <td className="px-3 py-3">
        <div className="font-medium">{r.name || <span className="text-stone-400">Unnamed</span>}</div>
        {r.city && <div className="text-xs text-stone-500 dark:text-stone-400">{r.city}</div>}
        {dup && <span className="mt-1 inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"><Copy size={11} />Duplicate</span>}
      </td>
      <td className="px-3 py-3 text-sm">{r.wilaya || '-'}</td>
      <td className="px-3 py-3 text-sm tabular-nums">
        {r.phone ?? <span className="text-rose-600 dark:text-rose-400">Invalid / Unknown</span>}
        {r.phoneKind === 'landline' && <div className="text-xs text-stone-500">Landline, no WhatsApp</div>}
        {!r.phone && r.phoneRaw && <div className="text-xs text-stone-500">{r.phoneRaw}</div>}
      </td>
      <td className="px-3 py-3">
        <div className="relative inline-block">
          <StatusBadge status={status} />
          <select aria-label="Change status" className="absolute inset-0 cursor-pointer opacity-0" value={status} onChange={e => onStatus(e.target.value as Status)}>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        {t?.contactedAt && <div className="mt-1 text-xs text-stone-500 dark:text-stone-400">{new Date(t.contactedAt).toLocaleString()}</div>}
      </td>
      <td className="px-3 py-3 text-right">
        <button className="btn btn-primary" disabled={!ok} onClick={onContact} title={ok ? 'Open WhatsApp' : 'No valid WhatsApp number'}>
          <MessageCircle size={16} />WhatsApp
        </button>
      </td>
    </tr>
  )
}
