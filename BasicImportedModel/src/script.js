import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

const gui = new GUI()
const gltfLoader = new GLTFLoader()

const canvas = document.querySelector('canvas.webgl')
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const aspectRatio = sizes.width/sizes.height

// Model Loading


const scene = new THREE.Scene()

const floorGeometry = new THREE.PlaneGeometry(10,10)
const floorMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    metalness: 0.2,
    side: THREE.DoubleSide 
})

const floor = new THREE.Mesh(floorGeometry, floorMaterial)

floorMaterial.color = new THREE.Color('#4E4D4B')

floor.rotation.x = Math.PI/2
floorMaterial.roughness  = 0.4
floorMaterial.metalness = 0.3
floor.receiveShadow = true

scene.add(floor)

// Light
const light  = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(light)

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

console.log(directionalLight)

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.set(-3,3,3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// // controls.enabled= false
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

// Shadow Configuration
//renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setSize(sizes.width, sizes.height)

renderer.setPixelRatio(window.devicePixelRatio)

const clock = new THREE.Clock()
let oldElapsedTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const delta = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    controls.update()

    renderer.render(scene,camera)

    window.requestAnimationFrame(tick)

}

tick()

