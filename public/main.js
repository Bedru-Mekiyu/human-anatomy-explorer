import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

class HumanAnatomyExplorer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.world = new CANNON.World();
        this.bodies = [];
        this.meshes = [];
        this.composer = null;
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.tooltip = document.createElement('div');
        this.selectedObject = null;

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0x000000);

        this.camera.position.set(0, 5, 15);
        console.log('Camera position:', this.camera.position);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.world.gravity.set(0, -9.82, 0);

        this.setupLights();
        this.loadOrgans();
        this.loadSkeleton();
         this.setupPhysics(); // Temporarily disabled to avoid physics displacement
        this.setupPostProcessing();
        this.setupInteractions();
        this.setupTooltip();

        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('click', (event) => this.onMouseClick(event));
        document.addEventListener('keydown', (event) => this.onKeyDown(event));

        this.animate();
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 5, 0);
        this.scene.add(pointLight);
    }
    loadOrgans() {
    console.log('Loading organs...');
    const organs = [
        { name: 'Heart', texture: '/heart.jpg', normal: '/heart_normal.jpg', position: new THREE.Vector3(0, 2, 0), pulse: true },
        { name: 'Lungs', texture: '/lungs.jpg', normal: '/lungs_normal.jpg', position: new THREE.Vector3(2, 3, 0), breathe: true },
        { name: 'Liver', texture: '/liver.jpg', normal: '/liver_normal.jpg', position: new THREE.Vector3(-2, 1, 0) },
        { name: 'Brain', texture: '/brain.jpg', normal: '/brain_normal.jpg', position: new THREE.Vector3(0, 5, 0) },
        { name: 'Kidneys', texture: '/kidneys.jpg', normal: '/kidneys_normal.jpg', position: new THREE.Vector3(-1, 0, 0) },
    ];

    organs.forEach(organ => {
        console.log(`Adding ${organ.name} at ${organ.position.x}, ${organ.position.y}, ${organ.position.z}`);
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(organ.texture),
            normalMap: textureLoader.load(organ.normal),
            roughness: 0.5,
            metalness: 0.1
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(organ.position);
        mesh.userData = { name: organ.name, pulse: organ.pulse, breathe: organ.breathe };
        this.scene.add(mesh);
        this.meshes.push(mesh);

        const shape = new CANNON.Sphere(0.5);
        const body = new CANNON.Body({ mass: 1, shape });
        body.position.copy(organ.position);
        this.world.addBody(body);
        this.bodies.push(body);
    });
    console.log('Organs loaded');
}

   loadSkeleton() {
    const loader = new GLTFLoader();
    loader.load('/skeleton.glb', (gltf) => {
        const skeleton = gltf.scene;
        skeleton.scale.set(10, 10, 10); // Default scale, adjust if needed
        skeleton.position.set(0, 0.5, 0); // Raise slightly above origin
        skeleton.traverse((node) => {
            if (node.isMesh) {
                node.material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red material for testing
                node.material.needsUpdate = true; // Ensure material updates
            }
        });
        this.scene.add(skeleton);
        console.log('Skeleton loaded successfully, scale:', skeleton.scale, 'position:', skeleton.position, 'Scene children:', this.scene.children.length);
    }, undefined, (error) => {
        console.error('Failed to load skeleton.glb:', error);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, 0);
        this.scene.add(cube);
        console.log('Fallback cube added at (0, 0, 0)');
    });
}

    setupPhysics() {
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.4, 0.85);
        this.composer.addPass(bloomPass);
    }

    setupInteractions() {
        this.tooltip.style.position = 'absolute';
        this.tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
        this.tooltip.style.color = 'white';
        this.tooltip.style.padding = '5px';
        this.tooltip.style.borderRadius = '5px';
        this.tooltip.style.pointerEvents = 'none';
        document.body.appendChild(this.tooltip);
    }

    setupTooltip() {
        this.tooltip.style.display = 'none';
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.meshes);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            this.tooltip.style.display = 'block';
            this.tooltip.style.left = event.clientX + 10 + 'px';
            this.tooltip.style.top = event.clientY + 10 + 'px';
            this.tooltip.innerText = obj.userData.name;
        } else {
            this.tooltip.style.display = 'none';
        }
    }

    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.meshes);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            this.selectedObject = obj;
            this.controls.target.copy(obj.position);
            this.camera.position.set(obj.position.x, obj.position.y + 2, obj.position.z + 3);
        }
    }

    onKeyDown(event) {
        const moveSpeed = 0.1;
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);

        switch (event.key.toLowerCase()) {
            case 'w':
                this.camera.position.add(forward.multiplyScalar(moveSpeed));
                break;
            case 's':
                this.camera.position.sub(forward.multiplyScalar(moveSpeed));
                break;
            case 'a':
                this.camera.position.sub(right.multiplyScalar(moveSpeed));
                break;
            case 'd':
                this.camera.position.add(right.multiplyScalar(moveSpeed));
                break;
            case 'r':
                this.camera.position.set(0, 5, 15);
                this.controls.target.set(0, 0, 0);
                break;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
         this.world.step(1 / 60, delta); // Temporarily disabled

        this.bodies.forEach((body, i) => {
             this.meshes[i].position.copy(body.position); // Temporarily disabled
             this.meshes[i].quaternion.copy(body.quaternion); // Temporarily disabled

            const mesh = this.meshes[i];
            mesh.rotation.y += 0.01;

            if (mesh.userData.pulse) {
                const scale = 1 + 0.1 * Math.sin(this.clock.getElapsedTime() * 2);
                mesh.scale.set(scale, scale, scale);
            }
            if (mesh.userData.breathe) {
                const scale = 1 + 0.05 * Math.sin(this.clock.getElapsedTime() * 1.5);
                mesh.scale.set(1, scale, 1);
            }
        });

        this.controls.update();
        this.composer.render();
    }
}

new HumanAnatomyExplorer();