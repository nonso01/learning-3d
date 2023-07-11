import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

import eruda from "eruda";

import { log, dq } from "./util";

//eruda.init();

const app = dq("#app");
const wireframe = true;
const [_w, _h] = [window.innerWidth, window.innerHeight];

const Scene = new T.Scene();
const Camera = new T.PerspectiveCamera(75, _w / _h, 0.1, 1000);
const Renderer = new T.WebGLRenderer({
  antialias: true,
});
Renderer.setPixelRatio(window.devicePixelRatio);
Renderer.setSize(_w, _h);

app.append(Renderer.domElement);

const light = new T.DirectionalLight(0xffffff, 15);

const boxGeo = new T.TorusKnotGeometry(1, 0.35, 70, 70, 2, 1);

const boxMesh = new T.MeshNormalMaterial({
  // color: 0x424242,
});

const box = new T.Mesh(boxGeo, boxMesh);

for (const s of [box, light]) Scene.add(s);

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

  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
}
animate();
