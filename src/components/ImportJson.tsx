import { useRef } from 'react'
import { Upload } from 'lucide-react'
export default function ImportJson({ onText, onError }: { onText: (text: string, file: string) => void; onError: (m: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <input ref={ref} type="file" accept=".json,application/json" className="hidden" onChange={async e => {
        const f = e.target.files?.[0]; e.target.value = ''
        if (!f) return
        try { onText(await f.text(), f.name) } catch { onError('Could not read that file.') }
      }} />
      <button className="btn btn-primary" onClick={() => ref.current?.click()}><Upload size={16} />Import JSON</button>
    </>
  )
}
