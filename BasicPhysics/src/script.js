import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'


const gui = new GUI()


const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()

const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshStandardMaterial( {side: THREE.DoubleSide, roughness:0.4} );
const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );

planeMaterial.color = new THREE.Color('#4E4D4B')

planeMesh.position.y = -0.65;
planeMesh.rotation.x = Math.PI/2
planeMesh.receiveShadow = true

scene.add( planeMesh );


const sphereGeometry = new THREE.SphereGeometry(1,32,16)
const sphereMaterial = new THREE.MeshStandardMaterial()

const sphereMesh = new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
)

sphereMaterial.roughness  = 0.4
sphereMesh.position.y = 0.5
sphereMesh.castShadow = true
scene.add(sphereMesh)

// Light
const light = new THREE.AmbientLight( 0xffffff, 2  );
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.z = 6
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
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = false

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
