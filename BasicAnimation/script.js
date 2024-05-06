import * as THREE from 'three'
import './style.css'
import gsap  from 'gsap'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)

    
    //console.log(cursor.x, cursor.y)
    console.log(event.clientX, event.clientY)
})


// Canvas
const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', (event) => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera
    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()
    console.log("window has been resized")

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

window.addEventListener('dblclick', () => {

    //const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    }
    else {
        document.exitFullscreen()
    }
})

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1,1,1, 3,3,3) // Geometry
const material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true }) // Material
const mesh = new THREE.Mesh(geometry, material) // Mesh


scene.add(mesh)

// Object
// const geometry2 = new THREE.BoxGeometry(0.8,0.2,1) // Geometry
// const material2 = new THREE.MeshBasicMaterial({color: 0xff0000 }) // Material
// const mesh2 = new THREE.Mesh(geometry2, material2) // Mesh
// scene.add(mesh2)

const aspectRatio = sizes.width/sizes.height
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
// const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1*aspectRatio, 1, - 1, 0.1, 100)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)

console.log(controls)
// controls.enabled= false
controls.enableDamping = true
// controls.target.y = 1
// controls.update()


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// To remove blurry pixel
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))



// Animate
// gsap.to(mesh.position, {duration:1, delay:1, x:2})
// gsap.to(mesh.position, {duration:2, delay:2, x:0})

const clock = new THREE.Clock()

const tick = ()  => {

    // let currentTime = Date.now()
    // let deltaTime = currentTime - time
    // time  = currentTime

    const elapsedTime = clock.getElapsedTime()

    controls.update()
    
    // mesh.position.x = Math.sin(elapsedTime)
    // mesh.position.y = Math.cos(elapsedTime)

    // mesh.rotation.y = elapsedTime

    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2

    // camera.position.y = cursor.y * 3

    // camera.lookAt(mesh.position)

    

    renderer.render(scene,camera)

//    console.log(deltaTime)

    window.requestAnimationFrame(tick)


}

tick()

