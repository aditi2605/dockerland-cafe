// components/common/Footer.jsx
import { Link } from 'react-router-dom'
import { Coffee, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-cafe-espresso text-cafe-steam mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold text-cafe-latte mb-3">
              <Coffee size={20} />
              DockerLand Café
            </div>
            <p className="text-sm text-cafe-steam/70 leading-relaxed">
              Learning Docker one cup at a time. ☕<br />
              Built as an open-source portfolio project.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-cafe-latte mb-3">On The Menu</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['/lessons',    '📚 Lessons'],
                ['/labs',       '🍳 Hands-on Labs'],
                ['/cheat-sheet','📋 Cheat Sheet'],
                ['/progress',   '📊 My Progress'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-cafe-latte transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Docker theme legend */}
          <div>
            <h3 className="font-semibold text-cafe-latte mb-3">The Café Dictionary</h3>
            <ul className="space-y-1 text-sm text-cafe-steam/80">
              <li>🧾 Dockerfile = Recipe</li>
              <li>🖼️ Image = Meal Blueprint</li>
              <li>🍽️ Container = Cooked Meal</li>
              <li>🪟 Port = Serving Window</li>
              <li>🧊 Volume = Fridge</li>
              <li>🛤️ Network = Waiter Path</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cafe-brown mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cafe-steam/50">
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-cafe-latte" /> for Docker learners everywhere
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-cafe-latte transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
