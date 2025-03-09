import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()
const debugObject = {}

debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'
debugObject.fogColor = '#0bea1a'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(4, 4, 1028, 1028)

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uBigWavesElevation: {value: 0.2},
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWaveSpeed: {value: 0.75},

        uTime: { value: 0 },
        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0.25},
        uColorMultiplier: {value: 2},

        uSmallWavesElevation: {value: 0.12},
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: {value: 0.2},
        uSmallWavesIterations: {value: 4}
    },
    side: THREE.DoubleSide
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

mesh.rotation.x = - Math.PI * 0.5


gui.addColor(debugObject, 'depthColor').onChange(() => {
    material.uniforms.uDepthColor.value.set(debugObject.depthColor)
})

gui.addColor(debugObject, 'surfaceColor').onChange(() => {
    material.uniforms.uDepthColor.value.set(debugObject.surfaceColor)
})

gui.add(material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
 

gui.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
gui.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

gui.add(material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(material.uniforms.uSmallWavesIterations, 'value').min(0).max(5).step(1).name('uSmallWavesIterations')
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Lights
const ambientLight = new THREE.AmbientLight('#b9d5ff', 1.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.26)
directionalLight.position.set(-2, 2,1)
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256

directionalLight.shadow.mapSize.far = 7

directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
scene.add(directionalLight)
directionalLight.castShadow = false

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 'red')
scene.add(directionalLightHelper)
directionalLightHelper.visible = false



//fog
const fog = new THREE.FogExp2(debugObject.fogColor, 500)
scene.fog = fog

// scene.fog = fog

gui.addColor(debugObject, 'fogColor').onChange(() => {
    fog.value.set(debugObject.fogColor);
})

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 0.2, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#9bd8ff')


renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // updating varying time for shader
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()