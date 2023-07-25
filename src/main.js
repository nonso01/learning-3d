import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import Stats from "three/addons/libs/stats.module.js";

import eruda from "eruda";

import { dq } from "./util.js";

// eruda.init();

const log = console.log;

const app = dq("#app");

const wireframe = true;

const [_w, _h] = [window.innerWidth, window.innerHeight];

const bgColor = new T.Color(0x000000);
//0xe0e0e9

let Mesh; // custom

const Loader = new OBJLoader();
const MLoader = new MTLLoader();

const Obj = new T.Object3D();

const Scene = new T.Scene();
Scene.background = bgColor;

const Camera = new T.PerspectiveCamera(75, _w / _h, 0.1, 1000);

const Renderer = new T.WebGLRenderer({
  antialias: true,
});

Renderer.setPixelRatio(window.devicePixelRatio);
Renderer.setSize(_w, _h);

const Stat = new Stats();

app.append(Renderer.domElement, Stat.dom);

const Axes = new T.AxesHelper(5);

const lightCover = new T.Mesh(
  new T.SphereGeometry(0.2, 32, 32),
  new T.MeshBasicMaterial({ color: "white" }),
);
const pointLight = new T.PointLight("white", 0.3);

lightCover.add(pointLight);

lightCover.position.y = 10;

const dirLight = new T.AmbientLight(0xffffff, 0.8);

MLoader.load("/Room.mtl", (material) => {
  Loader.setMaterials(material);

  Loader.load(
    "/Room.obj",
    (obj) => {
      obj.receiveShadow = true;
      Scene.add(obj);
    },
    (xhr) => {
      log((xhr.loaded / xhr.total) * 100 + " %loaded");
    },
    (error) => {
      log("an error ocuured");
    },
  );
});

Camera.position.z = 25;

const controls = new OrbitControls(Camera, Renderer.domElement);
controls.minDistance = 0;
controls.maxDistance = 500;

for (const s of [Obj, lightCover, dirLight]) Scene.add(s);

function handleResize() {
  const [_w, _h] = [window.innerWidth, window.innerHeight];
  Camera.aspect = _w / _h;
  Camera.updateProjectionMatrix();
  Renderer.setSize(_w, _h);
}

window.addEventListener("resize", handleResize);

function animate() {
  requestAnimationFrame(animate);

  /*const t = new Date().getTime() * 0.00025;

  lightCover.position.x = Math.sin(t * -7) * 50;
  lightCover.position.y = Math.cos(t * 7) * 50;
  lightCover.position.z = Math.cos(t * -7) * 50;*/

  Renderer.render(Scene, Camera);

  for (const s of Obj.children) {
    s.rotation.y += 0.01;
  }

  Stat.update();
}
animate();
