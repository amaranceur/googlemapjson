import { LayoutDashboard, Store, BellRing, Sparkles, Settings, Moon, Sun } from 'lucide-react'
export type View = 'dashboard' | 'restaurants' | 'followups' | 'cleaning' | 'settings'
const ITEMS: [View, string, typeof Store][] = [
  ['dashboard', 'Dashboard', LayoutDashboard], ['restaurants', 'Restaurants', Store], ['followups', 'Follow-ups', BellRing],
  ['cleaning', 'Data Cleaning', Sparkles], ['settings', 'Settings', Settings]
]
export default function Sidebar({ view, onView, dark, onDark, followCount }: { view: View; onView: (v: View) => void; dark: boolean; onDark: () => void; followCount: number }) {
  return (
    <aside className="flex shrink-0 gap-1 overflow-x-auto border-b border-stone-200 bg-white p-2 md:h-screen md:w-56 md:flex-col md:border-b-0 md:border-r md:p-4 dark:border-stone-800 dark:bg-stone-900">
      <div className="hidden px-2 pb-4 font-semibold md:block">Restaurant Outreach</div>
      {ITEMS.map(([v, label, Icon]) => (
        <button key={v} onClick={() => onView(v)} aria-current={view === v}
          className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${view === v ? 'bg-teal-50 font-medium text-teal-800 dark:bg-teal-900/30 dark:text-teal-200' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'}`}>
          <Icon size={16} />{label}
          {v === 'followups' && followCount > 0 && <span className="ml-auto rounded-full bg-amber-500 px-1.5 text-xs text-white">{followCount}</span>}
        </button>
      ))}
      <button onClick={onDark} className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 md:ml-0 md:mt-auto dark:text-stone-300 dark:hover:bg-stone-800">
        {dark ? <Sun size={16} /> : <Moon size={16} />}<span className="hidden md:inline">{dark ? 'Light mode' : 'Dark mode'}</span>
      </button>
    </aside>
  )
}
