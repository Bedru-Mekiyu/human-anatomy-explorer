# Human Anatomy Explorer Documentation

## Overview
This project is an interactive 3D human anatomy explorer built using Three.js, showcasing key organs with realistic rendering and user interactions.

## Setup Instructions
1. Navigate to the project directory: `cd human-anatomy-explorer`
2. Install Node.js and npm if not already installed.
3. Run `npm install` to install dependencies.
4. Place organ textures in `src/textures` and skeleton.glb in `src/models`.
5. Run `npm start` to launch the development server.
6. Open `http://localhost:5173` in a browser.

## Features
- **3D Objects**: Heart, lungs, liver, brain, kidneys, and a GLTF skeletal frame.
- **Camera Controls**: OrbitControls for smooth navigation.
- **Lighting**: Ambient, directional, and point lights for realism.
- **Interactions**: Click to focus on organs with labels, hover for tooltips, WASD for camera movement, R to reset.
- **Textures**: Realistic organ textures with normal maps.
- **Animations**: Pulsating heart, breathing lungs, subtle organ rotation.
- **Post-Processing**: Bloom effect for highlighted organs.
- **Physics**: Cannon.js for subtle organ movement.

## How to Use
- Click an organ to focus the camera and display its name.
- Hover over organs to see tooltips with organ names.
- Use WASD keys to move the camera.
- Press R to reset the camera to the initial view.
- Use the mouse to orbit and zoom.

## Dependencies
- Three.js
- Cannon-es
- Vite

## Directory Structure
- `src/js`: JavaScript source code
- `src/models`: GLTF models
- `src/textures`: Texture and normal map images
- `public`: Static files for hosting
- `docs`: Documentation and presentation slides
