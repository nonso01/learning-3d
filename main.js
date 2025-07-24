import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const { innerHeight, innerWidth } = window;
const log = console.log;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const app = document.querySelector("#app");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high-DPI
app.appendChild(renderer.domElement);

scene.background = new THREE.Color(0xffffff);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;
controls.update();

const gui = new GUI();
const settings = { wireframe: false }; // Control state
let modelMaterials = []; // Store GLTF materials

// GLTF Loader
const gltfLoader = new GLTFLoader();
const url = "/fornitures-house.glb";
gltfLoader.load(
  url,
  (gltf) => {
    const root = gltf.scene;
    scene.add(root);
    // Collect all materials from the model
    root.traverse((child) => {
      if (child.isMesh && child.material) {
        modelMaterials.push(child.material);
      }
    });
    // Add GUI control for wireframe
    gui
      .add(settings, "wireframe")
      .name("Wireframe")
      .onChange((value) => {
        modelMaterials.forEach((material) => {
          material.wireframe = value;
        });
      });
  },
  (progress) => {
    log(
      `Loading model: ${((progress.loaded / progress.total) * 100).toFixed(2)}%`
    );
  },
  (error) => {
    log("Error loading GLTF model:", error);
  }
);

// Resize handler
const resizeRendererToDisplaySize = () => {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  return needResize;
};

function animate() {
  resizeRendererToDisplaySize(); // Check resize every frame
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
