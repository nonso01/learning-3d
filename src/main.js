import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import Stats from "three/addons/libs/stats.module.js";

import eruda from "eruda";

import { dq } from "./util.js";

eruda.init();

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

const Axes = new T.AxesHelper(10);

const particleCount = 1000
const particleGroup = new T.Group()

// 3d work below 

const lightCover = new T.Mesh(
  new T.SphereGeometry(2, 32, 32),
  new T.MeshBasicMaterial({ color: "white" }),
);
const pointLight = new T.PointLight("white", 2);

lightCover.add(pointLight);

const dirLight = new T.AmbientLight(0xffffff); // rm this later

const particle_geo = new T.SphereGeometry(.3, 32, 32);
const particle_mat = new T.MeshPhongMaterial({
  color: 0xccedff,
});

for (let i = 10; i < particleCount; i++) {
  Mesh = new T.Mesh(particle_geo, particle_mat);
  Mesh.position.x = i * (Math.random() - 0.5) * 10;
  Mesh.position.y = i * (Math.random() - 0.5) * 10;
  Mesh.position.z = i * (Math.random() - 0.5) * 10;

  particleGroup.add(Mesh);
}


const ring_geo = new T.RingGeometry(9.5, 10, 64)
const ring_mat = new T.MeshBasicMaterial({
  color: "silver",
  side: T.DoubleSide
})
const ring = new T.Mesh(ring_geo, ring_mat)

Camera.position.z = 25;

const controls = new OrbitControls(Camera, Renderer.domElement);
controls.minDistance = 0;
controls.maxDistance = 500;

for (const s of [Axes, Obj, lightCover, particleGroup, ring]) Scene.add(s);

function handleResize() {
  const [_w, _h] = [window.innerWidth, window.innerHeight];
  Camera.aspect = _w / _h;
  Camera.updateProjectionMatrix();
  Renderer.setSize(_w, _h);
}

window.addEventListener("resize", handleResize);

function animate() {
  requestAnimationFrame(animate);

  const t = new Date().getTime() * 0.000025;

  lightCover.position.x = Math.sin(t * -7) * 100;
  lightCover.position.y = Math.cos(t * 7) * 100;
  lightCover.position.z = Math.cos(t * -7) * 100;
  

  Renderer.render(Scene, Camera);

  /*for (const s of Obj.children) {
    s.rotation.y += 0.01;
  }*/

  Stat.update();
}
animate();
