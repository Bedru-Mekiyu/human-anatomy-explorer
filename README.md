# Human Anatomy Explorer

An interactive, web-based 3D Human Anatomy Explorer built with **Three.js**, **Vite**, and **Cannon-es**. The application renders key human organs with realistic textures and normal mapping alongside a 3D GLTF skeleton model, interactive orbit controls, camera focused transitions, organ animations, and post-processing bloom effects.

---

## 📸 Overview & Features

- **Interactive 3D Organs & Skeleton**: Renders realistic 3D models of major human organs (Heart, Lungs, Liver, Brain, Kidneys) with diffuse and normal maps, along with a 3D skeletal frame (`skeleton.glb`).
- **Interactive Camera Focus**: Click on any organ to transition camera focus directly to it.
- **Dynamic Tooltips**: Hover over organs to display dynamic UI tooltips with organ names.
- **Animated Organ Dynamics**: Pulse animations for the heart and breathing motions for the lungs.
- **Post-Processing**: UnrealBloomPass post-processing built with Three.js `EffectComposer` for enhanced scene rendering.
- **Physics Integration**: Cannon-es physics world integration.
- **Keyboard Navigation**: WASD controls for free camera movement and 'R' key to reset the view.

---

## 🛠 Tech Stack

- **Frontend Engine**: [Three.js](https://threejs.org/) (v0.176.0)
- **Physics Engine**: [Cannon-es](https://github.com/pmndrs/cannon-es) (v0.20.0)
- **Build Tool / Bundler**: [Vite](https://vitejs.dev/) (v6.3.5)
- **3D Asset Formats**: GLTF (`.glb`), Standard Image Textures & Normal Maps (`.jpg`)

---

## 📂 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI build workflow
├── docs/
│   └── documentation.md       # Project documentation
├── public/
│   ├── index.html             # Entry HTML document
│   ├── main.js                # Core 3D application, controls, & animations
│   ├── skeleton.glb           # 3D GLTF Skeletal model
│   └── *.jpg                  # Organ diffuse and normal map textures
├── package.json               # Node dependencies and build scripts
├── package-lock.json          # Lockfile
└── vite.config.js             # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd human-anatomy-explorer
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

### Running Locally

To launch the Vite development server locally:

```bash
npm start
```

Then open `http://localhost:5173` in your browser.

---

## 🎮 Controls & Usage

| Input / Control | Action |
| --- | --- |
| **Left Click (Organ)** | Focuses camera on the selected organ |
| **Mouse Hover** | Displays tooltip with organ name |
| **Mouse Drag / Scroll** | Orbit, pan, and zoom camera controls |
| **W / A / S / D** | Move camera forward, left, backward, right |
| **R** | Reset camera to initial view |

---

## 🔨 Build & Production

To build the static production bundle:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

---

## 🧪 CI/CD

Continuous Integration is configured via GitHub Actions in `.github/workflows/ci.yml`. On pull requests and pushes to `main`/`master`, the workflow automatically verifies dependency installation (`npm ci`) and production build execution (`npm run build`).

---

## 📄 License

This project is open-source and licensed under the [ISC License](LICENSE).
