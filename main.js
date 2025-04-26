import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const wireframe = true;
const { innerHeight, innerWidth } = window;
const log = console.log;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const app = document.querySelector("#app");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setAnimationLoop(animate);
app.appendChild(renderer.domElement);

scene.background = new THREE.Color(0xffffff);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);
scene.add(ambientLight);
// const geometry = new THREE.TorusKnotGeometry(1.4, .5, 100, 64);
// const material = new THREE.MeshNormalMaterial();
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;
controls.update();

const gui = new GUI();
// gui.add(material, "wireframe");

window.onresize = () => {
  const { innerHeight, innerWidth } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
};

{
  const objLoader = new OBJLoader();
  objLoader.load("/m.obj", (root) => {
    scene.add(root);
  });

  const mtlLoader = new MTLLoader();
  mtlLoader.load("/m.mtl", (mtl) => {
    mtl.preload();
    // mtl.materials.Material.side = THREE.DoubleSide;
    objLoader.setMaterials(mtl);
    objLoader.load("/m.obj", (root) => {
      gui.add(root, "visible").name("visible");
      scene.add(root);
    });
  });
}

function animate() {
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}
