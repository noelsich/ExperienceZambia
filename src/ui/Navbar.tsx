import { useState } from 'react'
import { Compass, Menu, X } from 'lucide-react'
import { useScrolled } from './useScrolled'

const links = [
  { href: '#marketplace', label: 'Marketplace' },
  { href: '#paths', label: 'Paths' },
]

export default function Navbar() {
  const scrolled = useScrolled(60)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition ${
        scrolled ? 'bg-zinc-950/90 py-3 shadow-2xl backdrop-blur-xl' : 'bg-black/35 py-4 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center bg-[linear-gradient(135deg,#169b62_0_34%,#d21034_34%_62%,#050505_62%_78%,#ff8200_78%)]">
            <Compass className="h-6 w-6 text-white" />
          </span>
          <span className="leading-none">
            <span className="block text-lg font-black uppercase tracking-[0.18em] text-white">Experience</span>
            <span className="block text-sm font-black uppercase tracking-[0.24em] text-[#ff8200]">Zambia</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-xs font-black uppercase tracking-[0.18em] text-white/70 transition hover:text-[#ff8200]">
              {link.label}
            </a>
          ))}
          <a href="mailto:providers@experiencezambia.example?subject=List%20my%20tourism%20agency" className="bg-[#169b62] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#127f51]">
            List an operator
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center border border-white/15 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="mx-4 mt-3 border border-white/10 bg-zinc-950 p-3 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-white/10 px-2 py-4 text-sm font-black uppercase tracking-[0.16em] text-white/75"
            >
              {link.label}
            </a>
          ))}
          <a href="mailto:providers@experiencezambia.example?subject=List%20my%20tourism%20agency" onClick={() => setMenuOpen(false)} className="mt-3 block bg-[#169b62] px-4 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-white">
            List an operator
          </a>
        </div>
      )}
    </nav>
  )
}
