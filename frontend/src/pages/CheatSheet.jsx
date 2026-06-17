// pages/CheatSheet.jsx — One-page Docker reference ("Recipe Book")
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'

const SECTIONS = [
  {
    title: '📦 Images  (Meal Blueprints)',
    commands: [
      { cmd: 'docker images',                          desc: 'List all images on your machine' },
      { cmd: 'docker pull nginx:latest',               desc: 'Download an image from Docker Hub (the supermarket)' },
      { cmd: 'docker build -t myapp:1.0 .',           desc: 'Build an image from a Dockerfile (cook from a recipe)' },
      { cmd: 'docker rmi myapp:1.0',                  desc: 'Delete an image' },
      { cmd: 'docker tag myapp:1.0 myapp:stable',     desc: 'Add a new tag to an image' },
      { cmd: 'docker push myrepo/myapp:1.0',          desc: 'Push image to Docker Hub' },
    ]
  },
  {
    title: '🍽️ Containers  (Cooked Meals)',
    commands: [
      { cmd: 'docker ps',                              desc: 'List running containers' },
      { cmd: 'docker ps -a',                           desc: 'List ALL containers (including stopped)' },
      { cmd: 'docker run nginx',                       desc: 'Run a container from an image (cook the meal)' },
      { cmd: 'docker run -d -p 8080:80 nginx',        desc: '-d = background, -p = port mapping (serving window)' },
      { cmd: 'docker run --name mybox nginx',         desc: 'Give the container a name' },
      { cmd: 'docker run --rm nginx',                 desc: 'Auto-remove container when it exits' },
      { cmd: 'docker stop mybox',                     desc: 'Gracefully stop a container' },
      { cmd: 'docker kill mybox',                     desc: 'Force-stop a container immediately' },
      { cmd: 'docker rm mybox',                       desc: 'Delete a stopped container' },
      { cmd: 'docker logs mybox',                     desc: 'View container output / logs' },
      { cmd: 'docker exec -it mybox bash',            desc: 'Open a shell inside a running container' },
    ]
  },
  {
    title: '🧊 Volumes  (The Fridge)',
    commands: [
      { cmd: 'docker volume ls',                      desc: 'List all volumes' },
      { cmd: 'docker volume create my-data',          desc: 'Create a named volume' },
      { cmd: 'docker run -v my-data:/app/data nginx', desc: 'Mount a volume into a container' },
      { cmd: 'docker run -v $(pwd):/app nginx',       desc: 'Bind-mount current directory (host path)' },
      { cmd: 'docker volume rm my-data',              desc: 'Delete a volume' },
      { cmd: 'docker volume prune',                   desc: 'Delete ALL unused volumes ⚠️' },
    ]
  },
  {
    title: '🛤️ Networks  (Waiter Paths)',
    commands: [
      { cmd: 'docker network ls',                     desc: 'List all networks' },
      { cmd: 'docker network create my-net',          desc: 'Create a custom network' },
      { cmd: 'docker run --network my-net nginx',     desc: 'Connect a container to a network' },
      { cmd: 'docker network inspect my-net',         desc: 'See which containers are on a network' },
      { cmd: 'docker network rm my-net',              desc: 'Delete a network' },
    ]
  },
  {
    title: '📋 Docker Compose  (Restaurant Manager)',
    commands: [
      { cmd: 'docker compose up',                     desc: 'Start all services defined in docker-compose.yml' },
      { cmd: 'docker compose up --build',             desc: 'Rebuild images then start (use after code changes)' },
      { cmd: 'docker compose up -d',                  desc: 'Start in background (detached mode)' },
      { cmd: 'docker compose down',                   desc: 'Stop and remove containers + networks' },
      { cmd: 'docker compose down -v',                desc: 'Also remove volumes ⚠️' },
      { cmd: 'docker compose logs -f',                desc: 'Follow logs from all services' },
      { cmd: 'docker compose ps',                     desc: 'List compose service containers' },
      { cmd: 'docker compose exec backend bash',      desc: 'Shell into a compose service container' },
    ]
  },
  {
    title: '🧹 Cleanup Commands',
    commands: [
      { cmd: 'docker system prune',                   desc: 'Remove all stopped containers, unused networks, dangling images' },
      { cmd: 'docker system prune -a',                desc: 'Remove everything not currently used ⚠️' },
      { cmd: 'docker image prune',                    desc: 'Remove dangling (untagged) images' },
      { cmd: 'docker container prune',                desc: 'Remove all stopped containers' },
    ]
  },
  {
    title: '🧾 Dockerfile Keywords  (Recipe Instructions)',
    commands: [
      { cmd: 'FROM python:3.11-slim',                 desc: 'Base image to build on (start with a clean kitchen)' },
      { cmd: 'WORKDIR /app',                          desc: 'Set working directory inside the container' },
      { cmd: 'COPY src/ /app/',                       desc: 'Copy files from host → container' },
      { cmd: 'RUN pip install -r requirements.txt',  desc: 'Run a command during build time' },
      { cmd: 'ENV PORT=8000',                         desc: 'Set an environment variable' },
      { cmd: 'EXPOSE 8000',                           desc: 'Document which port the app uses (informational)' },
      { cmd: 'CMD ["python", "main.py"]',             desc: 'Default command to run when container starts' },
      { cmd: 'ENTRYPOINT ["python"]',                 desc: 'Fixed start command (CMD provides arguments)' },
    ]
  },
]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-cafe-latte hover:text-cafe-brown"
      title="Copy command"
    >
      {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
    </button>
  )
}

export default function CheatSheet() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">📋</div>
        <h1 className="font-display text-4xl font-bold text-cafe-brown mb-2">Recipe Book</h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Every Docker command you'll ever need, organised by category.
          Hover a row to copy the command instantly.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title} className="menu-card">
            <h2 className="font-display font-bold text-cafe-brown text-xl mb-4">
              {section.title}
            </h2>
            <div className="divide-y divide-cafe-steam">
              {section.commands.map(({ cmd, desc }) => (
                <div key={cmd} className="group flex gap-4 py-3 items-start">
                  {/* Command */}
                  <div className="flex items-center min-w-0 shrink-0 w-full max-w-xs md:max-w-sm">
                    <code className="font-mono text-sm bg-cafe-espresso text-cafe-cream px-2 py-1 rounded whitespace-nowrap overflow-x-auto max-w-full">
                      {cmd}
                    </code>
                    <CopyButton text={cmd} />
                  </div>
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Print tip */}
      <p className="text-center text-sm text-gray-400 mt-8">
        💡 Tip: Press <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">Ctrl+P</kbd> to save this page as a PDF reference.
      </p>
    </div>
  )
}
