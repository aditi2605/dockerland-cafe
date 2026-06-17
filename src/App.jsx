import "./App.css";

function App() {
  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Docker Learning Made Simple</p>
        <h1>Welcome to DockerLand Café</h1>
        <p className="hero-text">
          Learn Docker through a fun café story where Dockerfiles are recipes,
          images are recipe cards, containers are cooked meals, ports are serving
          windows, and volumes are fridges.
        </p>

        <div className="hero-buttons">
          <a href="#lessons" className="primary-button">
            Start Learning
          </a>
          <a href="#concepts" className="secondary-button">
            View Concepts
          </a>
        </div>
      </section>

      <section id="concepts" className="concept-section">
        <h2>Docker Concepts Using Café Examples</h2>

        <div className="concept-grid">
          <div className="concept-card">
            <h3>Dockerfile</h3>
            <p>
              A Dockerfile is like a recipe. It tells Docker how to prepare your
              application environment step by step.
            </p>
          </div>

          <div className="concept-card">
            <h3>Image</h3>
            <p>
              A Docker image is like a recipe card or meal blueprint. It is ready
              to be used to create containers.
            </p>
          </div>

          <div className="concept-card">
            <h3>Container</h3>
            <p>
              A container is like the cooked meal. It is the running version of
              your image.
            </p>
          </div>

          <div className="concept-card">
            <h3>Port</h3>
            <p>
              A port is like a serving window. It lets people outside access the
              app running inside the container.
            </p>
          </div>
        </div>
      </section>

      <section id="lessons" className="lesson-section">
        <h2>Learning Path</h2>

        <ol className="lesson-list">
          <li>What is Docker?</li>
          <li>Why Docker solves “it works on my machine”</li>
          <li>Image vs Container</li>
          <li>Dockerfile basics</li>
          <li>Ports, Volumes, and Networks</li>
          <li>Docker Compose</li>
          <li>Hands-on DockerLand Café project</li>
        </ol>
      </section>
    </main>
  );
}

export default App;