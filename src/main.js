import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
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
  new T.SphereGeometry(2, 32, 32),
  new T.MeshBasicMaterial({ color: "orange" }),
);
const pointLight = new T.PointLight("orange", 2);

lightCover.add(pointLight);

const dirLight = new T.AmbientLight(0xffffff);

const geo = new T.BoxGeometry(5, 5, 5);
const mat = new T.MeshPhongMaterial({
  // color: "orange",
  map: new T.TextureLoader().load("/kene.jpg"),
});

for (let i = 5; i < 100; i++) {
  Mesh = new T.Mesh(geo, mat);
  Mesh.position.x = i * (Math.random() - 0.5) * 5;
  Mesh.position.y = i * (Math.random() - 0.5) * 5;
  Mesh.position.z = i * (Math.random() - 0.5) * 5;

  Obj.add(Mesh);
}

Camera.position.z = 25;

const controls = new OrbitControls(Camera, Renderer.domElement);
controls.minDistance = 0;
controls.maxDistance = 500;

for (const s of [Axes, Obj, lightCover, dirLight]) Scene.add(s);

function handleResize() {
  const [_w, _h] = [window.innerWidth, window.innerHeight];
  Camera.aspect = _w / _h;
  Camera.updateProjectionMatrix();
  Renderer.setSize(_w, _h);
}

window.addEventListener("resize", handleResize);

function animate() {
  requestAnimationFrame(animate);

  const t = new Date().getTime() * 0.00025;

  lightCover.position.x = Math.sin(t * -7) * 50;
  lightCover.position.y = Math.cos(t * 7) * 50;
  lightCover.position.z = Math.cos(t * -7) * 50;

  Renderer.render(Scene, Camera);

  for (const s of Obj.children) {
    s.rotation.y += 0.01;
  }

  Stat.update();
}
animate();
