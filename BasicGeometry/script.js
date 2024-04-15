import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap  from 'gsap'
import GUI from 'lil-gui'

// Debug
const gui = new GUI()
const debugObject = {}

const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


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

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect  = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

const scene = new THREE.Scene()

// const geometry = new THREE.BufferGeometry()
// const count = 1
// const positionsArray = new Float32Array(count * 3 * 3)

// for (let i=0; i < count*3*3; i++){
//     positionsArray[i] = (Math.random() - 0.5) * 4
// }

// const positionAttribute = new  THREE.BufferAttribute(positionsArray, 3)
// geometry.setAttribute('position', positionAttribute)


debugObject.color = '#b34747'

const geometry = new THREE.BoxGeometry(1,1,1,5,5,5)

const material = new THREE.MeshBasicMaterial({color: debugObject.color, wireframe: true})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh);

gui.add(mesh.position, 'y',-3, 3,0.01).name('elevation')
gui.add(mesh, 'visible')
gui.add(material, 'wireframe')
gui.addColor(debugObject, 'color')
    .onChange((value) => {
        material.color.set(debugObject.color)
    }
)

debugObject.subDivision = 2
gui.add(debugObject, 'subDivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(1,1,1, debugObject.subDivision, debugObject.subDivision, debugObject.subDivision)
    })





const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// // controls.enabled= false
controls.enableDamping = true

//spin cube
debugObject.spin = () => {
    gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + Math.PI * 2})
}
gui.add(debugObject, 'spin')

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// To remove blurry pixel
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

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

