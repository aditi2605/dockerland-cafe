// pages/Labs.jsx — Hands-on lab exercises ("The Kitchen")
import { useState } from 'react'
import { Copy, CheckCheck, Terminal, ChefHat } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// ── Lab data (static — no API needed for reference content) ─────────────────
const LABS = [
  {
    id: 1,
    title: 'Lab 1: Pull Your First Image 🛒',
    subtitle: 'Visit the Supermarket (Docker Hub)',
    difficulty: 'beginner',
    duration: '5 min',
    objective: 'Pull a pre-built image from Docker Hub — the public "supermarket" of images.',
    steps: [
      {
        title: 'Check Docker is installed',
        command: 'docker --version',
        explanation: 'This confirms Docker is running on your machine.',
        expected: 'Docker version 24.x.x, build ...',
      },
      {
        title: 'Pull the official Nginx image from Docker Hub',
        command: 'docker pull nginx:latest',
        explanation: '"nginx" is the image name. "latest" is the tag (version). Docker downloads every layer of the image.',
        expected: 'Status: Downloaded newer image for nginx:latest',
      },
      {
        title: 'List your downloaded images',
        command: 'docker images',
        explanation: 'Like listing everything in your fridge — these are all your meal blueprints.',
        expected: 'REPOSITORY   TAG       IMAGE ID   CREATED   SIZE\nnginx        latest    ...',
      },
    ]
  },
  {
    id: 2,
    title: 'Lab 2: Run Your First Container 🍽️',
    subtitle: 'Cook a Meal (Start a Container)',
    difficulty: 'beginner',
    duration: '10 min',
    objective: 'Start a container from the nginx image and open it in your browser.',
    steps: [
      {
        title: 'Run the nginx container',
        command: 'docker run -d -p 8080:80 --name my-first-container nginx',
        explanation: '-d = run in background (detached)\n-p 8080:80 = "serving window" — map your port 8080 to the container\'s port 80\n--name = give it a friendly name',
        expected: 'a1b2c3d4e5f6... (a container ID)',
      },
      {
        title: 'Check the container is running',
        command: 'docker ps',
        explanation: 'Like looking at the kitchen pass — what meals are currently being served?',
        expected: 'CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS',
      },
      {
        title: 'View it in your browser',
        command: 'open http://localhost:8080   # or visit it manually',
        explanation: 'You should see the Nginx welcome page! The container is serving over port 8080.',
        expected: '🌐 Nginx welcome page appears in browser',
      },
      {
        title: 'Stop and remove the container',
        command: 'docker stop my-first-container && docker rm my-first-container',
        explanation: 'Like clearing the table. The meal (container) is gone, but the blueprint (image) remains.',
        expected: 'my-first-container\nmy-first-container',
      },
    ]
  },
  {
    id: 3,
    title: 'Lab 3: Write a Dockerfile 🧾',
    subtitle: 'Write Your Own Recipe',
    difficulty: 'beginner',
    duration: '15 min',
    objective: 'Create a Dockerfile to package a simple Python app into an image.',
    steps: [
      {
        title: 'Create a project folder and a simple app',
        command: 'mkdir my-app && cd my-app\necho "print(\'Hello from Docker!\')" > app.py',
        explanation: 'We\'ll package this one-line Python script into a Docker image.',
        expected: 'Files created in my-app/',
      },
      {
        title: 'Create the Dockerfile (your recipe)',
        command: `# Create a file called "Dockerfile" with this content:

FROM python:3.11-slim
# ^ The base image — like saying "start with a clean kitchen stocked for Python"

WORKDIR /app
# ^ Set the working directory inside the container

COPY app.py .
# ^ Copy our script into the container (COPY <host> <container>)

CMD ["python", "app.py"]
# ^ The default command to run when the container starts`,
        explanation: 'Every Dockerfile starts with FROM (what base to build on) and ends with CMD (what to run).',
        expected: 'Dockerfile created',
      },
      {
        title: 'Build your image',
        command: 'docker build -t my-python-app:1.0 .',
        explanation: '-t = tag (name:version)\n. = "use the Dockerfile in this directory"\nDocker reads each FROM/COPY/CMD line and creates image layers.',
        expected: 'Successfully built abc123\nSuccessfully tagged my-python-app:1.0',
      },
      {
        title: 'Run your image as a container',
        command: 'docker run my-python-app:1.0',
        explanation: 'Your recipe became an image. The image is now being cooked into a container!',
        expected: 'Hello from Docker!',
      },
    ]
  },
  {
    id: 4,
    title: 'Lab 4: Volumes — The Fridge 🧊',
    subtitle: 'Keep Your Data Fresh',
    difficulty: 'beginner',
    duration: '10 min',
    objective: 'Use a volume to persist data even after a container is removed.',
    steps: [
      {
        title: 'Create a named volume',
        command: 'docker volume create my-fridge',
        explanation: 'A named volume is like a dedicated fridge shelf — data lives here even when the container is gone.',
        expected: 'my-fridge',
      },
      {
        title: 'Run a container that writes to the volume',
        command: 'docker run --rm -v my-fridge:/data alpine sh -c "echo \'Hello from the fridge!\' > /data/note.txt"',
        explanation: '-v my-fridge:/data mounts the volume at /data inside the container\n--rm removes the container when done (but the volume survives!)',
        expected: '(no output — it ran and exited)',
      },
      {
        title: 'Read the data from a NEW container',
        command: 'docker run --rm -v my-fridge:/data alpine cat /data/note.txt',
        explanation: 'A brand-new container, but it can read the data we saved earlier. That\'s persistence!',
        expected: 'Hello from the fridge!',
      },
    ]
  },
]

// ── Copy-to-clipboard hook ──────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(null)
  const copy = async (text, key) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }
  return { copied, copy }
}

export default function Labs() {
  const [activeTab, setActiveTab] = useState(0)
  const { copied, copy } = useCopy()

  const lab = LABS[activeTab]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🍳</div>
        <h1 className="font-display text-4xl font-bold text-cafe-brown mb-2">The Kitchen</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Hands-on labs. Every command is copy-pasteable.
          Make sure Docker is installed before you start!
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {LABS.map((l, i) => (
          <button
            key={l.id}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-cafe text-sm font-medium transition-colors
              ${activeTab === i
                ? 'bg-cafe-brown text-cafe-cream'
                : 'bg-cafe-steam text-cafe-brown hover:bg-cafe-latte/30'
              }`}
          >
            Lab {l.id}
          </button>
        ))}
      </div>

      {/* Active lab */}
      <div className="menu-card">
        {/* Lab header */}
        <div className="border-b border-cafe-steam pb-4 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-cafe-brown">{lab.title}</h2>
              <p className="text-cafe-latte font-medium mt-1">{lab.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <span className="badge bg-green-100 text-green-800">{lab.difficulty}</span>
              <span className="badge bg-blue-100 text-blue-800">⏱ {lab.duration}</span>
            </div>
          </div>
          <div className="mt-4 bg-cafe-steam rounded-cafe p-3 flex items-start gap-2">
            <ChefHat size={18} className="text-cafe-brown mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700"><strong>Objective:</strong> {lab.objective}</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {lab.steps.map((step, si) => (
            <div key={si}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-cafe-latte text-cafe-espresso text-xs font-bold flex items-center justify-center shrink-0">
                  {si + 1}
                </div>
                <h3 className="font-semibold text-cafe-brown">{step.title}</h3>
              </div>

              {/* Command block */}
              <div className="relative group">
                <SyntaxHighlighter
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{ borderRadius: '12px', margin: 0, fontSize: '0.85rem' }}
                >
                  {step.command}
                </SyntaxHighlighter>
                {/* Copy button */}
                <button
                  onClick={() => copy(step.command, `${lab.id}-${si}`)}
                  className="absolute top-3 right-3 bg-cafe-brown/60 hover:bg-cafe-brown text-cafe-cream px-2.5 py-1.5 rounded text-xs flex items-center gap-1 transition-colors"
                >
                  {copied === `${lab.id}-${si}`
                    ? <><CheckCheck size={12} /> Copied!</>
                    : <><Copy size={12} /> Copy</>
                  }
                </button>
              </div>

              {/* Explanation */}
              <p className="text-sm text-gray-600 mt-2 ml-9 leading-relaxed">
                💡 {step.explanation}
              </p>

              {/* Expected output */}
              <div className="ml-9 mt-2 bg-green-50 border border-green-200 rounded-cafe px-3 py-2">
                <span className="text-xs font-semibold text-green-700">Expected output: </span>
                <span className="text-xs font-mono text-green-800">{step.expected}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
