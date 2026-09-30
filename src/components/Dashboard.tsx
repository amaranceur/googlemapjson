import { useEffect, useMemo, useState } from 'react'
import { Download, FileJson, SkipForward, MessageSquareText } from 'lucide-react'
import { STATUS_LABEL, canWhatsApp, type Restaurant, type Status, type TrackingMap } from '../types'
import StatsCards from './StatsCards'
import SearchBar from './SearchBar'
import Filters, { type StatusFilter } from './Filters'
import RestaurantTable, { type SortKey } from './RestaurantTable'
import { duplicateCounts } from '../utils/duplicates'

interface P {
  list: Restaurant[]; tracking: TrackingMap; showStats: boolean; presetStatus: StatusFilter
  onStatus: (key: string, s: Status) => void; onContact: (r: Restaurant) => void
  onExport: (kind: 'csv' | 'json') => void; onMessage: () => void; importButton: React.ReactNode
}
const ORDER: Status[] = ['new', 'contacted', 'follow_up', 'interested', 'not_interested']

export default function Dashboard(p: P) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<StatusFilter>(p.presetStatus)
  const [wilaya, setWilaya] = useState('')
  const [sort, setSort] = useState<SortKey>('name')
  const [asc, setAsc] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  useEffect(() => setStatus(p.presetStatus), [p.presetStatus])

  const dupes = useMemo(() => duplicateCounts(p.list), [p.list])
  const wilayas = useMemo(() => [...new Set(p.list.map(r => r.wilaya).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [p.list])
  const st = (r: Restaurant): Status => p.tracking[r.key]?.status ?? 'new'

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase()
    const digits = n.replace(/\D/g, '')
    const f = p.list.filter(r => {
      if (status !== 'all' && st(r) !== status) return false
      if (wilaya && r.wilaya !== wilaya) return false
      if (!n) return true
      return [r.name, r.wilaya, r.city, r.phone ?? '', r.phoneRaw].some(v => v.toLowerCase().includes(n)) ||
        (digits.length > 2 && (r.phone ?? '').replace(/\D/g, '').includes(digits))
    })
    const dir = asc ? 1 : -1
    return f.sort((a, b) => {
      let c = 0
      if (sort === 'name') c = a.name.localeCompare(b.name)
      else if (sort === 'wilaya') c = a.wilaya.localeCompare(b.wilaya)
      else if (sort === 'status') c = ORDER.indexOf(st(a)) - ORDER.indexOf(st(b))
      else c = (p.tracking[a.key]?.contactedAt ?? '').localeCompare(p.tracking[b.key]?.contactedAt ?? '')
      return c * dir
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.list, p.tracking, q, status, wilaya, sort, asc])

  const toggleSort = (k: SortKey) => { if (k === sort) setAsc(!asc); else { setSort(k); setAsc(true) } }
  const toggle = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const selectAll = (ids: string[], on: boolean) => setSelected(s => { const n = new Set(s); ids.forEach(i => (on ? n.add(i) : n.delete(i))); return n })

  // Open Next: one conversation per click, only for selected rows not yet contacted.
  const queue = rows.filter(r => selected.has(r.id) && canWhatsApp(r) && st(r) === 'new')
  const openNext = () => { const r = queue[0]; if (r) { p.onContact(r); setSelected(s => { const n = new Set(s); n.delete(r.id); return n }) } }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{p.presetStatus === 'follow_up' ? 'Follow-ups' : 'Restaurants'}</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">You send every message yourself in WhatsApp. Nothing is sent automatically.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {p.importButton}
          <button className="btn" onClick={() => p.onExport('csv')} disabled={!p.list.length}><Download size={16} />Export CSV</button>
          <button className="btn" onClick={() => p.onExport('json')} disabled={!p.list.length}><FileJson size={16} />Export JSON</button>
          <button className="btn" onClick={p.onMessage}><MessageSquareText size={16} />Message settings</button>
        </div>
      </div>
      {p.showStats && <StatsCards list={p.list} tracking={p.tracking} />}
      <div className="flex flex-wrap items-center gap-2">
        <SearchBar value={q} onChange={setQ} />
        <Filters status={status} onStatus={setStatus} wilaya={wilaya} onWilaya={setWilaya} wilayas={wilayas} />
      </div>
      {selected.size > 0 && (
        <div className="card flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm">
          <span className="font-medium">Selected: {selected.size} <span className="font-normal text-stone-500">({queue.length} ready to contact)</span></span>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={openNext} disabled={!queue.length}><SkipForward size={16} />Open Next</button>
            <button className="btn" onClick={() => setSelected(new Set())}>Clear</button>
          </div>
        </div>
      )}
      <RestaurantTable rows={rows} tracking={p.tracking} dupes={dupes} selected={selected} sort={sort} asc={asc} onSort={toggleSort}
        onSelect={toggle} onSelectAll={selectAll} onStatus={p.onStatus} onContact={p.onContact} />
      <p className="text-xs text-stone-500">Statuses: {Object.values(STATUS_LABEL).join(', ')}. Data stays in this browser.</p>
    </div>
  )
}
