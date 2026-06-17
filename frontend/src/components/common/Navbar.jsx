// components/common/Navbar.jsx — The top navigation bar, visible on every page.
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Coffee } from 'lucide-react'

// Navigation links — one array to keep things DRY
const NAV_LINKS = [
  { to: '/lessons',    label: '📚 Menu'        },  // lessons = menu items
  { to: '/labs',       label: '🍳 Kitchen'     },  // labs = hands-on cooking
  { to: '/progress',  label: '📊 My Tab'      },  // progress = running tab
  { to: '/cheat-sheet', label: '📋 Recipe Book' }, // cheat sheet = recipe book
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  // Helper: is this link the currently active page?
  const isActive = (to) => pathname.startsWith(to)

  return (
    <nav className="bg-cafe-espresso text-cafe-cream shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold hover:text-cafe-latte transition-colors">
            <Coffee size={24} className="text-cafe-latte" />
            <span>DockerLand <span className="text-cafe-latte">Café</span></span>
          </Link>

          {/* ── Desktop links ─────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-cafe text-sm font-medium transition-colors
                  ${isActive(to)
                    ? 'bg-cafe-latte text-cafe-espresso'
                    : 'hover:bg-cafe-brown hover:text-cafe-cream'
                  }`}
              >
                {label}
              </Link>
            ))}
            {/* CTA button */}
            <Link to="/lessons" className="ml-3 bg-cafe-latte text-cafe-espresso px-4 py-2 rounded-cafe text-sm font-semibold hover:bg-cafe-cream transition-colors">
              Start Learning →
            </Link>
          </div>

          {/* ── Mobile hamburger ─────────────────────────────── */}
          <button
            className="md:hidden p-2 rounded-cafe hover:bg-cafe-brown transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile menu dropdown ─────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-cafe text-sm font-medium transition-colors
                  ${isActive(to)
                    ? 'bg-cafe-latte text-cafe-espresso'
                    : 'hover:bg-cafe-brown'
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
