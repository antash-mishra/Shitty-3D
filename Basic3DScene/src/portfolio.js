import * as THREE from 'three'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import typeFaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import GUI from 'lil-gui'
import { flattenJSON } from 'three/src/animation/AnimationUtils'
import gsap from 'gsap'

const gui = new GUI()

const parameters = {}

parameters.materialColor = '#ffeded';

gui.addColor(parameters, 'materialColor')
.onChange(() => {
    console.log(material.color)
    material.color.set(parameters.materialColor)
    particleMaterial.color.set(parameters.materialColor)
})

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const aspectRatio = sizes.width/sizes.height

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
console.log(gradientTexture)
const material = new THREE.MeshToonMaterial()
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
material.gradientMap = gradientTexture
material.color = new THREE.Color(parameters.materialColor)

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.5, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1,2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1,0.5, 100, 16),
    material
)


// mesh1.position.y = 2
//mesh1.scale.set(0.5,0.5,0.5)
// mesh2.visible = false
//mesh2.scale.set(0.5, 0.5, 0.5)
// mesh3.position.y = -2
//mesh3.scale.set(0.5,0.5,0.5)

mesh1.position.x = -4
mesh2.position.x = 4
mesh3.position.x = -4


const objectDistance = 6

mesh1.position.y = - objectDistance * 0
mesh2.position.y = - objectDistance * 1
mesh3.position.y = - objectDistance * 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

// Particle

const particleCount = 200
const positions = new Float32Array(particleCount * 3)

for (let i= 0; i <particleCount; i++) {
    const i3 = i*3
    positions[i3] = (Math.random() - 0.5)*10
    positions[i3+1] = objectDistance * 0.5  - Math.random() * objectDistance *sectionMeshes.length
    positions[i3+2] = (Math.random() - 0.5) * 10 
}

// Particle Geometry
const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Particle Material
const particleMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const particleMesh = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particleMesh)


window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect  = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Scroll
let scrollY = window.scrollY
let currentSection = 1

window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    const newSection = Math.round(scrollY/sizes.height)

    if(newSection != currentSection) {
        currentSection = newSection;

        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',   
            y: '+=3',
            z: '+=1.5'
        })

        console.log('changed', currentSection)
    }

})

// Cursor Movement
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x= event.clientX / sizes.width - 0.5
    cursor.y= event.clientY /sizes.height - 0.5

})

// Lights
const directionalLight  = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)


// Camera
const cameraGroup = new THREE.Group()
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.z = 6
cameraGroup.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})



renderer.setClearAlpha(0)

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

const clock = new THREE.Clock()
let previousTime =0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    for (const mesh  of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
    }

    // Camera movement with Scroll
    camera.position.y = - scrollY / sizes.height * objectDistance
    
    const parallelX =  cursor.x * 0.5
    const parallelY = - cursor.y * 0.5
    
    cameraGroup.position.x += (parallelX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallelY - cameraGroup.position.y) * 5 * deltaTime


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()






