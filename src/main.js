import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import Stats from 'three/addons/libs/stats.module.js'

import eruda from "eruda";

import { log, dq } from "./util.js";

// eruda.init();

const app = dq("#app");
const wireframe = true;
const [_w, _h] = [window.innerWidth, window.innerHeight];

const bgColor = new T.Color(0xe0e0e9)

const Scene = new T.Scene();
Scene.background = bgColor

const Camera = new T.PerspectiveCamera(75, _w / _h, 0.1, 1000);

const Renderer = new T.WebGLRenderer({
  antialias: true,
});

Renderer.setPixelRatio(window.devicePixelRatio);
Renderer.setSize(_w, _h);


const Stat = new Stats()


app.append(Renderer.domElement, Stat.dom);

const Axes = new T.AxesHelper(5)

const light = new T.DirectionalLight("red", 15);
light.position.x = 1

const light_two = new T.DirectionalLight("green", 15)
light_two.position.y = -1

const light_three = new T.DirectionalLight("blue", 15)

light_three.position.z = -5


const geometry_one = new T.DodecahedronGeometry(1.5, 0)

const geometry_one_mat = new T.MeshPhongMaterial({
  color: "black",
  // wireframe
});

const geometry_mesh = new T.Mesh(geometry_one, geometry_one_mat);

for (const s of [geometry_mesh, light, light_two, light_three, Axes]) Scene.add(s);

Camera.position.z = 5;

const controls = new OrbitControls(Camera, Renderer.domElement);
controls.minDistance = 3;
controls.maxDistance = 10;

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
  
  Stat.update()

  geometry_mesh.rotation.x += 0.01;
  geometry_mesh.rotation.y += 0.01;
}
animate();
