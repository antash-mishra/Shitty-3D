import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/Addons.js'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { GUI } from 'lil-gui'
import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'
import gpgpuParticleShader from './shaders/gpgpu/particle.glsl'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'

const gui = new GUI({width: 340})
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)



// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Materials
    particles.material.uniforms.uResolution.value.x = sizes.width * sizes.pixelRatio
    particles.material.uniforms.uResolution.value.y = sizes.height * sizes.pixelRatio

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4.5, 4, 11)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

debugObject.clearColor = '#29191f'
renderer.setClearColor(debugObject.clearColor)


// Load Model
const gltf = await gltfLoader.loadAsync('./model.glb')
console.log(gltf)


// Base Geometry
const baseGeometry = {}
baseGeometry.instance = gltf.scene.children[0].geometry
baseGeometry.count = baseGeometry.instance.attributes.position.count


// GPUCom,putation Renderer
const gpgpu = {}
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count))
gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, renderer)

const baseParticleTexture = gpgpu.computation.createTexture()

for (let i = 0; i < baseGeometry.count; i++) {
    const i3 = i * 3
    const i4 = i * 4
    baseParticleTexture.image.data[i4 + 0] = baseGeometry.instance.attributes.position.array[i3 + 0]
    baseParticleTexture.image.data[i4 + 1] = baseGeometry.instance.attributes.position.array[i3 + 1]
    baseParticleTexture.image.data[i4 + 2] = baseGeometry.instance.attributes.position.array[i3 + 2]
    baseParticleTexture.image.data[i4 + 3] = Math.random();

}


// PARTICLES Variable
gpgpu.particleVariable = gpgpu.computation.addVariable('uParticles', gpgpuParticleShader, baseParticleTexture)

gpgpu.computation.setVariableDependencies(gpgpu.particleVariable, [gpgpu.particleVariable])

// Uniforms
gpgpu.particleVariable.material.uniforms.uTime = new THREE.Uniform(0)
gpgpu.particleVariable.material.uniforms.uBase = new THREE.Uniform(baseParticleTexture)
gpgpu.particleVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0)
gpgpu.particleVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.5)
gpgpu.particleVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(2)
gpgpu.particleVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.5)




// Init
gpgpu.computation.init()

// Debug
gpgpu.debug = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particleVariable).texture})
)

gpgpu.debug.position.x = 3
gpgpu.debug.visible = false;
scene.add(gpgpu.debug)

console.log(gpgpu.computation.getCurrentRenderTarget(gpgpu.particleVariable).texture)

// Particles
const particles = {}
const particlesUvArray = new Float32Array(baseGeometry.count * 2)

// Randomize particle size
const sizeArray = new Float32Array(baseGeometry.count)



for (let y=0; y<gpgpu.size; y++) {
    for (let x=0; x<gpgpu.size; x++) {

        const i = y * gpgpu.size + x
        const i2 = i * 2
        const uvX = (x + 0.5) / gpgpu.size
        const uvY = (y + 0.5) / gpgpu.size

        particlesUvArray[i2 + 0] = uvX
        particlesUvArray[i2 + 1] = uvY

        sizeArray[i] = Math.random();
    }
}

particles.geometry = new THREE.BufferGeometry()
particles.geometry.setDrawRange(0, baseGeometry.count)

particles.geometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(particlesUvArray, 2))
particles.geometry.setAttribute('aColor',  baseGeometry.instance.attributes.color)
particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizeArray, 1))


particles.material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uSize: new THREE.Uniform(0.07),
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uParticlesTexture: new THREE.Uniform(),
    }
})

particles.point = new THREE.Points(particles.geometry, particles.material)
scene.add(particles.point)

const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // gpgpu update
    gpgpu.particleVariable.material.uniforms.uTime.value = elapsedTime;
    gpgpu.particleVariable.material.uniforms.uDeltaTime.value = deltaTime;
    gpgpu.computation.compute();
    particles.material.uniforms.uParticlesTexture.value = 
        gpgpu.computation.getCurrentRenderTarget(gpgpu.particleVariable).texture;

    

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()







