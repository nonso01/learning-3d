import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

import eruda from "eruda";

import { log, w, dq } from "./util";

// eruda.init();

const app = dq("#app");
const wireframe = true

const Scene = new T.Scene();
const Camera = new T.PerspectiveCamera(
  75,
  w.innerWidth / w.innerHeight,
  0.1,
  1000,
);
const Renderer = new T.WebGLRenderer({
  antialias: true,
});

Renderer.setSize(w.innerWidth, w.innerHeight);

app.append(Renderer.domElement);

const light = new T.DirectionalLight(0xffffff, 15);

const boxGeo = new T.TorusKnotGeometry(1, .35, 70, 70, 2, 1)

const boxMesh = new T.MeshNormalMaterial({
  // color: 0x424242,
});

const box = new T.Mesh(boxGeo, boxMesh);

for (const s of [box, light]) Scene.add(s);

Camera.position.z = 5;

const controls = new OrbitControls(Camera, Renderer.domElement);
controls.minDistance = 3;
controls.maxDistance = 10;


function animate() {
  requestAnimationFrame(animate);
  Renderer.render(Scene, Camera);

  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
}
animate();
