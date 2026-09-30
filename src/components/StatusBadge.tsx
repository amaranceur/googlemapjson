import { STATUS_LABEL, type Status } from '../types'
const DOT: Record<Status, string> = {
  new: 'bg-stone-400', contacted: 'bg-sky-500', interested: 'bg-emerald-500', not_interested: 'bg-rose-500', follow_up: 'bg-amber-500'
}
export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-2.5 py-1 text-xs font-medium dark:border-stone-700">
      <span className={`h-2 w-2 rounded-full ${DOT[status]}`} />{STATUS_LABEL[status]}
    </span>
  )
}
