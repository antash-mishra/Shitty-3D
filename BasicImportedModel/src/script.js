import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'

const gui = new GUI()
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()

const canvas = document.querySelector('canvas.webgl')
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const aspectRatio = sizes.width/sizes.height

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


// Model Loading

dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) => {
//         // console.log('success')
//         // console.log(gltf)
//         let children = [...gltf.scene.children]
//         for (const child of children) {
//             scene.add(child)
//         }
//     }
// )


// gltfLoader.load(
//     '/models/Duck/glTF-Draco/Duck.gltf',
//     (gltf) => {
//         scene.add(gltf.scene)
//     }

// )

let mixer = null

gltfLoader.load(
    'models/Fox/glTF/Fox.gltf',
    (gltf) => {

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()
    }
)



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

    // Animation Update
    if(mixer) {
        mixer.update(delta)
    }


    renderer.render(scene,camera)

    window.requestAnimationFrame(tick)

}

tick()

