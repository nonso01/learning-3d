import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import Stats from "three/addons/libs/stats.module.js";

import eruda from "eruda";

import { dq } from "./util.js";

//eruda.init();

const log = console.log;

const app = dq("#app");

const wireframe = true;

const [_w, _h] = [window.innerWidth, window.innerHeight];

const bgColor = new T.Color(0x000000);
//0xe0e0e9

let Mesh; // custom

const obj = new T.Object3D();

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

const geo = new T.SphereGeometry(2, 32, 32);
const mat = new T.MeshBasicMaterial({
  color: "orange",
  wireframe,
});
// const mesh = new T.Mesh(geo, mat)

Camera.position.z = 50;

const controls = new OrbitControls(Camera, Renderer.domElement);
controls.minDistance = 0;
controls.maxDistance = 500;

for (const s of [Axes]) Scene.add(s);

for (let i = 0; i < 100; i++) {
  Mesh = new T.Mesh(geo, mat);
  // obj.add(Mesh);

  Mesh.position.x = i * (Math.random() - 0.5) * 10;
  Mesh.position.y = i * (Math.random() - 0.5) * 10;
  Mesh.position.z = i * (Math.random() - 0.5) * 10;

  obj.add(Mesh);
}

Scene.add(obj);

function handleResize() {
  const [_w, _h] = [window.innerWidth, window.innerHeight];
  Camera.aspect = _w / _h;
  Camera.updateProjectionMatrix();
  Renderer.setSize(_w, _h);
}

window.addEventListener("resize", handleResize);

function animate() {
  requestAnimationFrame(animate);
  Renderer.render(Scene, Camera);

  for (const s of obj.children) {
    s.rotation.y += 0.01;
  }

  Stat.update();
}
animate();
