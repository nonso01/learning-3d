import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { TextGeometry } from "three/addons/geometries/TextGeometry";
import { FontLoader } from "three/addons/loaders/FontLoader";

import Stats from "three/addons/libs/stats.module.js";

import eruda from "eruda";

import { dq, len } from "./util.js";

eruda.init();

const log = console.log;

const app = dq("#app");

const wireframe = true;
const rS = 32;

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
Renderer.shadowMap.enabled = true;
Renderer.shadowMap.type = T.PCFSoftShadowMap;

const Stat = new Stats();

app.append(Renderer.domElement, Stat.dom);

const Axes = new T.AxesHelper(100);

const particleCount = 300;
const particleGroup = new T.Group();

// 3d work below

const pointLightCover = new T.Mesh(
  new T.SphereGeometry(1.5, rS, rS),
  new T.MeshBasicMaterial({ color: "white" }),
);
const pointLight = new T.PointLight("white", 4);
pointLight.castShadow = true;

pointLightCover.add(pointLight);

const dirLight = new T.DirectionalLight(0xffffff); // rm this later
dirLight.castShadow = true;

const particle_geo = new T.SphereGeometry(0.2, rS, rS);
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

const plane_geo = new T.PlaneGeometry(100, 100);
const plane_mat = new T.MeshPhongMaterial({
  color: 0x212121,
  side: T.DoubleSide,
});
const plane = new T.Mesh(plane_geo, plane_mat);

plane.receiveShadow = true;
plane.rotation.x = 1.57;

{
  let a = new FontLoader().load(
    "/node_modules/three/examples/fonts/droid/droid_sans_regular.typeface.json",
    (font) => {
      let b = new TextGeometry("nonso01", {
        font,
        size: 15,
        height: 5,
      });
      let m = new T.MeshPhongMaterial({ color: 0x454545 });
      let f = new T.Mesh(b, m);
      f.castShadow = true;
      f.position.set(-30, 10, 0);
      Scene.add(f);
    },
  );
}

Camera.position.z = Camera.position.y = Camera.position.x = 50;

const controls = new OrbitControls(Camera, Renderer.domElement);
controls.minDistance = 0;
controls.maxDistance = 500;

for (const s of [Obj, pointLightCover, dirLight, particleGroup, plane])
  Scene.add(s);

function handleResize() {
  const [_w, _h] = [window.innerWidth, window.innerHeight];
  Camera.aspect = _w / _h;
  Camera.updateProjectionMatrix();
  Renderer.setSize(_w, _h);
}

window.addEventListener("resize", handleResize);

function animate() {
  requestAnimationFrame(animate);

  const t = new Date().getTime() * 0.0002;

  pointLightCover.position.x = Math.sin(t * -7) * 75;
  pointLightCover.position.y = Math.cos(t * 7) * 75;
  pointLightCover.position.z = Math.cos(t * -7) * 50;

  Renderer.render(Scene, Camera);
  Stat.update();
}
animate();
