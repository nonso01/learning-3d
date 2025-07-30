import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
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

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 10, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
// directionalLight.shadow.camera.left = -15;
// directionalLight.shadow.camera.right = 15;
// directionalLight.shadow.camera.top = 15;
// directionalLight.shadow.camera.bottom = -15;
directionalLight.shadow.camera.near = 0.1; // Tighter near plane
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.bias = -0.0001; // Reduce shadow acne
directionalLight.shadow.normalBias = 0.05; // Adjust for surface normals
scene.add(directionalLight);

const lightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5,
  0xff0000
);
scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.minDistance = 1;
controls.maxDistance = 5.5;
controls.maxPolarAngle = Math.PI / 2;
//  log(controls)

camera.position.set(0, 5, 5);
controls.update();

const gui = new GUI();
const settings = { wireframe: false };
let modelMaterials = [];

// gui for orbit controls
gui.add(controls, "dampingFactor", 0, 1, 0.01).name("Damping Factor");
gui.add(directionalLight, "intensity", 0, 5, 1).name("DirLight Intensity");

// Load HDR environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  "/brown_photostudio_02_1k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  },
  undefined,
  (error) => {
    log("Error loading HDR texture:", error);
  }
);

// GLTF Loader with DRACOLoader when online
const loadingManager = new THREE.LoadingManager();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/"
);
dracoLoader.setDecoderConfig({ type: "js" });
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
        log(child.name)

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
    // log(
    //   `Loading model: ${((progress.loaded / progress.total) * 100).toFixed(1)}%`
    // );
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
