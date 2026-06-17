// pages/Home.jsx — Landing page for DockerLand Café
import { Link } from 'react-router-dom'
import { BookOpen, FlaskConical, Trophy, FileText, ArrowRight } from 'lucide-react'

// The café ↔ Docker concept mapping cards
const CONCEPTS = [
  { emoji: '🧾', cafe: 'Recipe',           docker: 'Dockerfile',       desc: 'Step-by-step instructions for building something' },
  { emoji: '🖼️', cafe: 'Meal Blueprint',   docker: 'Docker Image',     desc: 'The packaged, reusable template of your app' },
  { emoji: '🍽️', cafe: 'Cooked Meal',      docker: 'Container',        desc: 'A running instance of your image' },
  { emoji: '🪟', cafe: 'Serving Window',   docker: 'Port',             desc: 'How the outside world reaches your container' },
  { emoji: '🧊', cafe: 'Fridge',           docker: 'Volume',           desc: 'Persistent storage that survives container restarts' },
  { emoji: '🛤️', cafe: 'Waiter Path',      docker: 'Network',          desc: 'How containers communicate with each other' },
  { emoji: '📋', cafe: 'Restaurant Mgr',   docker: 'Docker Compose',   desc: 'Orchestrates multiple containers at once' },
  { emoji: '🛒', cafe: 'Supermarket',      docker: 'Docker Hub',       desc: 'Public registry of pre-built images' },
]

// Feature cards for the "What's on the menu" section
const FEATURES = [
  { icon: BookOpen,    title: 'Beginner Lessons',  desc: 'Bite-sized lessons that build on each other — no prior DevOps knowledge needed.', to: '/lessons',     cta: 'Browse Lessons'  },
  { icon: FlaskConical,title: 'Hands-on Labs',     desc: 'Copy-paste commands and see Docker in action inside real terminal examples.',       to: '/labs',        cta: 'Enter Kitchen'   },
  { icon: Trophy,      title: 'Quizzes',           desc: 'Test your understanding after each lesson to lock in what you have learned.',        to: '/lessons',     cta: 'Take a Quiz'     },
  { icon: FileText,    title: 'Cheat Sheet',       desc: 'One-page reference of every Docker command you need, always one click away.',        to: '/cheat-sheet', cta: 'Open Cheat Sheet'},
]

export default function Home() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-cafe-espresso via-cafe-brown to-cafe-latte text-cafe-cream py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-7xl mb-6">☕</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Welcome to <br /><span className="text-cafe-yellow">DockerLand Café</span>
          </h1>
          <p className="text-xl md:text-2xl text-cafe-steam/90 mb-3 font-light">
            Where Docker concepts taste like freshly brewed coffee
          </p>
          <p className="text-cafe-steam/70 mb-10 max-w-xl mx-auto">
            Whether you're completely new to tech or a developer who keeps dodging Docker —
            our café-themed lessons make containers click. No jargon. Just coffee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/lessons" className="bg-cafe-yellow text-cafe-espresso font-semibold px-8 py-3 rounded-cafe hover:bg-cafe-cream transition-colors flex items-center justify-center gap-2">
              See Today's Menu <ArrowRight size={18} />
            </Link>
            <Link to="/cheat-sheet" className="border-2 border-cafe-steam text-cafe-steam px-8 py-3 rounded-cafe hover:bg-cafe-brown transition-colors">
              📋 Docker Cheat Sheet
            </Link>
          </div>
        </div>
      </section>

      {/* ── Concept map ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-cafe-steam">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center">
            🗺️ The Café ↔ Docker Dictionary
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
            Every Docker concept maps to something you already know from a restaurant.
            Once you see it, you can't unsee it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONCEPTS.map(({ emoji, cafe, docker, desc }) => (
              <div key={docker} className="menu-card text-center group">
                <div className="text-4xl mb-3">{emoji}</div>
                <div className="font-display font-bold text-cafe-brown text-lg">{cafe}</div>
                <div className="text-xs font-mono text-cafe-latte bg-cafe-espresso/10 px-2 py-1 rounded mb-2 inline-block">
                  {docker}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's on the menu ────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-heading text-center">What's On The Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, to, cta }) => (
              <div key={title} className="menu-card flex gap-4">
                <div className="bg-cafe-steam rounded-cafe p-3 h-fit">
                  <Icon size={24} className="text-cafe-brown" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-cafe-brown text-xl mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{desc}</p>
                  <Link to={to} className="text-cafe-latte font-medium hover:text-cafe-brown transition-colors text-sm flex items-center gap-1">
                    {cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Docker-in-this-project callout ────────────────────────────────── */}
      <section className="py-16 px-4 bg-cafe-espresso text-cafe-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold mb-4 text-cafe-yellow">
            🐳 This Site Runs on Docker
          </h2>
          <p className="text-cafe-steam/80 mb-6 leading-relaxed">
            DockerLand Café is itself a Docker project! It runs as <strong>three containers</strong>:
            a React frontend, a FastAPI backend, and a PostgreSQL database — all wired together with
            Docker Compose. As you learn each concept, look for it inside this project.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'frontend', desc: 'React + Vite' },
              { label: 'backend',  desc: 'FastAPI + Python' },
              { label: 'db',       desc: 'PostgreSQL' },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-cafe-brown/40 rounded-cafe p-4">
                <div className="font-mono text-cafe-yellow text-sm font-bold">{label}</div>
                <div className="text-xs text-cafe-steam/70 mt-1">{desc}</div>
              </div>
            ))}
          </div>
          <p className="text-cafe-steam/50 text-sm mt-6">
            Run <code className="font-mono bg-cafe-brown/40 px-2 py-0.5 rounded">docker compose up --build</code> to start the whole café!
          </p>
        </div>
      </section>
    </div>
  )
}
