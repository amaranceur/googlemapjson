import { STATUSES, STATUS_LABEL, type Status } from '../types'
export type StatusFilter = Status | 'all'
interface P { status: StatusFilter; onStatus: (s: StatusFilter) => void; wilaya: string; onWilaya: (w: string) => void; wilayas: string[] }
export default function Filters({ status, onStatus, wilaya, onWilaya, wilayas }: P) {
  return (
    <>
      <select className="input" aria-label="Status filter" value={status} onChange={e => onStatus(e.target.value as StatusFilter)}>
        <option value="all">All statuses</option>
        {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
      </select>
      <select className="input" aria-label="Wilaya filter" value={wilaya} onChange={e => onWilaya(e.target.value)}>
        <option value="">All wilayas</option>
        {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
      </select>
    </>
  )
}
