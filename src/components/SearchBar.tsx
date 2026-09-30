import { Search } from 'lucide-react'
export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="relative block min-w-[220px] flex-1">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
      <input className="input w-full pl-9" placeholder="Search name, phone, wilaya, city" value={value} onChange={e => onChange(e.target.value)} />
    </label>
  )
}
