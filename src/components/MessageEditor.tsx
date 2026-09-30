import { RotateCcw } from 'lucide-react'
import { DEFAULT_MESSAGE, fillTemplate } from '../utils/whatsapp'
import type { Restaurant } from '../types'
export default function MessageEditor({ value, onChange, sample }: { value: string; onChange: (v: string) => void; sample?: Restaurant }) {
  const demo = sample ?? { id: '', key: '', name: 'Chez Karim', wilaya: 'Chlef', city: '', phone: null, phoneRaw: '', phoneKind: 'invalid' as const }
  return (
    <div className="card space-y-4 p-5">
      <div>
        <h2 className="font-semibold">WhatsApp message</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Use {'{{name}}'} and {'{{wilaya}}'}. They are replaced for each restaurant. Nothing is sent until you press send in WhatsApp.</p>
      </div>
      <textarea className="input min-h-[140px] w-full" value={value} onChange={e => onChange(e.target.value)} />
      <button className="btn" onClick={() => onChange(DEFAULT_MESSAGE)}><RotateCcw size={14} />Restore default</button>
      <div>
        <div className="mb-1 text-sm font-medium">Preview</div>
        <div className="rounded-lg bg-stone-100 p-3 text-sm dark:bg-stone-800">{fillTemplate(value, demo) || 'Empty message'}</div>
      </div>
    </div>
  )
}
