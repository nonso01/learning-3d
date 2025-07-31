import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
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

const gui = new GUI();

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

// gui for orbit controls
gui.add(controls, "dampingFactor", 0, 1, 0.01).name("Damping Factor");
gui.add(directionalLight, "intensity", 0, 5, 1).name("DirLight Intensity");

const geo = new THREE.BoxGeometry(2, 2, 1);
const mat = new THREE.MeshPhongMaterial({
  color: 0xfabc2e,
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

// Load HDR environment map
const rgbeLoader = new RGBELoader();
// rgbeLoader.load(
//   "/brown_photostudio_02_1k.hdr",
//   (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.background = texture;
//     scene.environment = texture;
//   },
//   undefined,
//   (error) => {
//     log("Error loading HDR texture:", error);
//   }
// );

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
  mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
