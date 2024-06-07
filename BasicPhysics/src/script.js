import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'
import CANNON from 'cannon'


const gui = new GUI()

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial( {side: THREE.DoubleSide, roughness:0.4} );
const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );

planeMaterial.color = new THREE.Color('#4E4D4B')

planeMesh.rotation.x = Math.PI/2
planeMaterial.roughness  = 0.4
planeMaterial.metalness = 0.3
planeMesh.receiveShadow = true

scene.add( planeMesh );


const sphereGeometry = new THREE.SphereGeometry(0.5,32,16)
const sphereMaterial = new THREE.MeshStandardMaterial()

const sphereMesh = new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
)

sphereMaterial.roughness  = 0.4
sphereMaterial.metalness = 0.3
sphereMesh.position.set(3,0.5, -3)
sphereMesh.castShadow = true
scene.add(sphereMesh)

// Light
const light = new THREE.AmbientLight( 0xffffff, 2.1  );
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)
directionalLightCameraHelper.visible = true

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(- 3, 3, 3)
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
// // controls.enabled= false
controls.enableDamping = true


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

// Shadow Configuration
//renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setSize(sizes.width, sizes.height)

// To remove blurry pixel
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))


const clock = new THREE.Clock()

const tick = ()  => {

    const elapsedTime = clock.getElapsedTime()

    controls.update()


    renderer.render(scene,camera)

//    console.log(deltaTime)

    window.requestAnimationFrame(tick)
}

tick()
