import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const { innerHeight, innerWidth } = window;
const log = console.log;

const BG = 0x222222;

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

scene.background = new THREE.Color(BG);

const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Increased intensity
const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // Reduced intensity
directionalLight.position.set(0, 10, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
directionalLight.shadow.camera.left = -15; // Wider bounds
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.bottom = -15;
directionalLight.shadow.camera.near = 0.1; // Tighter near plane
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.bias = -0.0001; // Reduce shadow acne
directionalLight.shadow.normalBias = 0.05; // Adjust for surface normals
scene.add(directionalLight);
scene.add(ambientLight);

const lightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5,
  0xff0000
);
scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.minDistance = 1.3;
controls.maxDistance = 6;

camera.position.set(0, 5, 5);
controls.update();

const gui = new GUI();
const settings = { wireframe: false };
let modelMaterials = [];

// gui for orbit controls
gui.add(controls, "enableDamping").name("Enable Damping");
gui.add(controls, "dampingFactor", 0, 1, 0.01).name("Damping Factor");

// gui.add(directionalLight.shadow, "normalBias", 0, 0.1, 0.01).name("Shadow Normal Bias");

// GLTF Loader
// const gltfLoader = new GLTFLoader();
// const url = "/fornitures-house.glb";

// GLTF Loader with DRACOLoader when online
const loadingManager = new THREE.LoadingManager();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/"
);
dracoLoader.setDecoderConfig( { type: 'js' } );
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);
const url = "/fornitures-house.glb";

gltfLoader.load(
  url,
  (gltf) => {
    const root = gltf.scene;
    root.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          modelMaterials.push(child.material);
        }
      }
    });
    scene.add(root);
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
  resizeRendererToDisplaySize();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
