import { useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import type { Restaurant, Status, TrackingMap } from '../types'
import RestaurantRow from './RestaurantRow'
import { isDuplicate } from '../utils/duplicates'

export type SortKey = 'name' | 'wilaya' | 'status' | 'date'
interface P {
  rows: Restaurant[]; tracking: TrackingMap; dupes: Map<string, number>; selected: Set<string>
  sort: SortKey; asc: boolean; onSort: (k: SortKey) => void
  onSelect: (id: string) => void; onSelectAll: (ids: string[], on: boolean) => void
  onStatus: (key: string, s: Status) => void; onContact: (r: Restaurant) => void
}
const PAGE = 150
export default function RestaurantTable(p: P) {
  const [limit, setLimit] = useState(PAGE)
  const shown = p.rows.slice(0, limit)
  const allOn = shown.length > 0 && shown.every(r => p.selected.has(r.id))
  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <th className="px-3 py-2 text-left font-medium">
      <button className="inline-flex items-center gap-1 hover:underline" onClick={() => p.onSort(k)}>
        {label}{p.sort === k && (p.asc ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
      </button>
    </th>
  )
  if (!p.rows.length) return <div className="card p-10 text-center text-sm text-stone-500">No restaurants match. Import a JSON file or change the filters.</div>
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-stone-100 text-stone-600 dark:bg-stone-800/60 dark:text-stone-300">
            <tr>
              <th className="w-10 px-3 py-2"><input type="checkbox" aria-label="Select all shown" checked={allOn} onChange={e => p.onSelectAll(shown.map(r => r.id), e.target.checked)} /></th>
              <Th k="name" label="Restaurant" /><Th k="wilaya" label="Wilaya" />
              <th className="px-3 py-2 text-left font-medium">Phone</th>
              <Th k="status" label="Status" /><th className="px-3 py-2 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {shown.map(r => (
              <RestaurantRow key={r.id} r={r} t={p.tracking[r.key]} dup={isDuplicate(r, p.dupes)} selected={p.selected.has(r.id)}
                onSelect={() => p.onSelect(r.id)} onStatus={s => p.onStatus(r.key, s)} onContact={() => p.onContact(r)} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-stone-200 px-4 py-2 text-sm text-stone-500 dark:border-stone-800">
        <span>Showing {shown.length} of {p.rows.length}</span>
        {limit < p.rows.length && <button className="btn" onClick={() => setLimit(l => l + PAGE)}>Show more</button>}
      </div>
    </div>
  )
}
