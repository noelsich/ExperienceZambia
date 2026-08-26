import { MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center bg-[#d21034]">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em]">Experience Zambia</p>
            <p className="text-xs font-semibold text-white/45">National discovery, province-ready booking.</p>
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
          Marketplace concept · Green · Red · Black · Orange
        </p>
      </div>
    </footer>
  )
}
