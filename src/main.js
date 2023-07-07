import * as T from "three"
import eruda from "eruda"
import { log, w, dq } from "./util"

//eruda.init()

const app = dq("#app")


const Scene = new T.Scene()
const Camera = new T.PerspectiveCamera(75, w.innerWidth / w.innerHeight, .1, 1000)
const Renderer = new T.WebGLRenderer()

Renderer.setSize(w.innerWidth, w.innerHeight)

app.append(Renderer.domElement)

const light = new T.DirectionalLight(0xffffff, 2)

const boxGeo = new T.BoxGeometry(1,1,1);
const boxMesh = new T.MeshStandardMaterial({
	color: 0x424242
})
const box = new T.Mesh(boxGeo, boxMesh)


for( const s of [box, light]) Scene.add(s)

Camera.position.z = 5

function animate() {
	requestAnimationFrame(animate)
	Renderer.render(Scene, Camera)

	box.rotation.x += 0.01
	box.rotation.y += .01
}
animate()
