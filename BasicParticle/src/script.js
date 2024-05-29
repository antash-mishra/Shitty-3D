import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


const canvas = document.querySelector('canvas.webgl')

let sizes = {
    width: window.innerWidth,
    height: innerHeight
}

const aspectRatio = sizes.width/sizes.height

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.z = 3
scene.add(camera);

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

const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

// const particleGeometry = new THREE.SphereGeometry(1,32,32)

const particleGeometry = new THREE.BufferGeometry()

const count  = 20000

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3)
for (let i=0; i< count*3; i++) {
    positions[i] = (Math.random() - 0.5)*10
    colors[i] = Math.random()
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

particleGeometry.size = 0.1


const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    transparent: true,
    alphaMap: particleTexture,
//    alphaTest: 0.001,
//    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    vertexColors: true
})

//particleMaterial.color = new THREE.Color('#ff88cc')

const particles = new THREE.Points(
    particleGeometry,    
    particleMaterial
)

scene.add(particles);

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

const controls = new OrbitControls(camera, canvas)
controls.enableDumping = true;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Particle

    // particles.rotation.y = Math.sin(elapsedTime*0.2) + Math.cos(elapsedTime)*0.2
    // particles.rotation.x = Math.sin(elapsedTime*0.2) + Math.cos(elapsedTime)*0.2

    for (let i=0; i< count; i++) {
        const i3 = i * 3

        const x = particleGeometry.attributes.position.array[i3]
        particleGeometry.attributes.position.array[i3 + 1] = Math.log(1 + Math.abs(elapsedTime + x)) * Math.sin(elapsedTime + x);

    }
    particleGeometry.attributes.position.needsUpdate = true

    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()