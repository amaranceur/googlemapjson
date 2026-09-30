import { useEffect, useMemo, useState } from 'react'
import Sidebar, { type View } from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ImportJson from './components/ImportJson'
import MessageEditor from './components/MessageEditor'
import DataCleaningModal from './components/DataCleaningModal'
import { STATUS_LABEL, type Restaurant, type Status, type TrackingMap } from './types'
import { parseRestaurants } from './utils/parse'
import { DEFAULT_MESSAGE, openWhatsApp } from './utils/whatsapp'
import { load, save } from './utils/storage'
import { download, toCsv, toRows } from './utils/csv'

export default function App() {
  const [list, setList] = useState<Restaurant[]>(() => load('outreach.list', []))
  const [tracking, setTracking] = useState<TrackingMap>(() => load('outreach.tracking', {}))
  const [template, setTemplate] = useState<string>(() => load('outreach.message', DEFAULT_MESSAGE))
  const [dark, setDark] = useState<boolean>(() => load('outreach.dark', window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false))
  const [view, setView] = useState<View>('dashboard')
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [modal, setModal] = useState(false)

  useEffect(() => save('outreach.list', list), [list])
  useEffect(() => save('outreach.tracking', tracking), [tracking])
  useEffect(() => save('outreach.message', template), [template])
  useEffect(() => { save('outreach.dark', dark); document.documentElement.classList.toggle('dark', dark) }, [dark])

  const onImport = (text: string, file: string) => {
    try {
      const { restaurants, skipped } = parseRestaurants(text)
      setList(restaurants) // tracking is keyed by normalized phone, so existing statuses carry over
      setMsg({ type: 'ok', text: `Imported ${restaurants.length} restaurants from ${file}${skipped ? `, skipped ${skipped} malformed entries` : ''}.` })
      setView('restaurants')
    } catch (e) { setMsg({ type: 'err', text: e instanceof Error ? e.message : 'Import failed.' }) }
  }
  const setStatus = (key: string, status: Status) =>
    setTracking(t => ({ ...t, [key]: { ...t[key], status } }))
  const contact = (r: Restaurant) => {
    if (!openWhatsApp(r, template)) return
    setTracking(t => {
      const cur = t[r.key]?.status ?? 'new'
      return { ...t, [r.key]: { status: cur === 'new' ? 'contacted' : cur, contactedAt: new Date().toISOString() } }
    })
  }
  const onExport = (kind: 'csv' | 'json') => {
    if (kind === 'csv') download('restaurants.csv', toCsv(list, tracking), 'text/csv')
    else download('restaurants.json', JSON.stringify(toRows(list, tracking), null, 2), 'application/json')
  }
  const followCount = useMemo(() => list.filter(r => tracking[r.key]?.status === 'follow_up').length, [list, tracking])
  const importButton = <ImportJson onText={onImport} onError={t => setMsg({ type: 'err', text: t })} />

  const common = { list, tracking, onStatus: setStatus, onContact: contact, onExport, onMessage: () => setView('settings'), importButton }
  return (
    <div className="min-h-screen md:flex">
      <Sidebar view={view} onView={v => (v === 'cleaning' ? setModal(true) : setView(v))} dark={dark} onDark={() => setDark(!dark)} followCount={followCount} />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-4 p-4 md:p-8">
        {msg && (
          <div role="status" className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${msg.type === 'err' ? 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200' : 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'}`}>
            <span>{msg.text}</span><button onClick={() => setMsg(null)} aria-label="Dismiss">✕</button>
          </div>
        )}
        {view === 'dashboard' && <Dashboard {...common} showStats presetStatus="all" />}
        {view === 'restaurants' && <Dashboard {...common} showStats={false} presetStatus="all" />}
        {view === 'followups' && <Dashboard {...common} showStats={false} presetStatus="follow_up" />}
        {view === 'settings' && (
          <div className="max-w-2xl space-y-4">
            <h1 className="text-xl font-semibold">Settings</h1>
            <MessageEditor value={template} onChange={setTemplate} sample={list[0]} />
            <div className="card flex items-center justify-between p-5 text-sm">
              <span>Saved data: {Object.keys(tracking).length} tracked contacts</span>
              <button className="btn" onClick={() => { if (confirm('Delete all restaurants and contact history from this browser?')) { setList([]); setTracking({}) } }}>Clear all data</button>
            </div>
            <p className="text-xs text-stone-500">Status values: {Object.values(STATUS_LABEL).join(', ')}.</p>
          </div>
        )}
      </main>
      {modal && <DataCleaningModal list={list} onClose={() => setModal(false)} />}
    </div>
  )
}
