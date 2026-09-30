import type { Restaurant, TrackingMap } from '../types'
import { canWhatsApp } from '../types'
export default function StatsCards({ list, tracking }: { list: Restaurant[]; tracking: TrackingMap }) {
  const valid = list.filter(canWhatsApp).length
  const contacted = list.filter(r => (tracking[r.key]?.status ?? 'new') !== 'new').length
  const items = [
    ['Total restaurants', list.length], ['Valid phone numbers', valid], ['Invalid numbers', list.length - valid],
    ['Contacted', contacted], ['Not contacted', list.length - contacted]
  ] as const
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {items.map(([label, n]) => (
        <div key={label} className="card p-4">
          <div className="text-2xl font-semibold tabular-nums">{n.toLocaleString()}</div>
          <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">{label}</div>
        </div>
      ))}
    </div>
  )
}
