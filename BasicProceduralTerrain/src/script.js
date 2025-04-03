import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js'
import { Evaluator, Brush, SUBTRACTION } from 'three-bvh-csg'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import terrainVertex from './shaders/terrain/terrainVertex.glsl'
import terrainFragment from './shaders/terrain/terrainFragment.glsl'

const gui = new GUI({width: 340})
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Loaders
const rgbeLoader = new RGBELoader()

// Environment Map
rgbeLoader.load('/spruit_sunrise.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.backgroundBlurriness = 0.5
    scene.environment = environmentMap
})

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

// Brush
const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11))
const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10))

// Evaluate
const evaluator = new Evaluator()
const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION)
board.geometry.clearGroups()
board.material = new THREE.MeshStandardMaterial({color: '#ffffff', metalness: 0, roughness: 0.3})
board.castShadow = true
board.receiveShadow = true
scene.add(board)


// Terrain
const geometry = new THREE.PlaneGeometry(10, 10, 500, 500)
geometry.deleteAttribute('uv')
geometry.deleteAttribute('normal')
geometry.rotateX(-Math.PI / 2)

debugObject.colorWaterDeep = '#002b3d'
debugObject.colorWaterSurface = '#66a8ff'
debugObject.colorSand = '#ffe894'
debugObject.colorGrass = '#85d534'
debugObject.colorSnow = '#ffffff'
debugObject.colorRock = '#bfbd8d'

const uniforms = {
    uTime: new THREE.Uniform(0.0),
    uPositionFrequency: new THREE.Uniform(0.2),
    uStrength: new THREE.Uniform(2.0),
    uWarpFrequency: new THREE.Uniform(5.0),
    uWarpStrength: new THREE.Uniform(0.5),
    uColorWaterDeep: new THREE.Uniform(new THREE.Color(debugObject.colorWaterDeep)),
    uColorWaterSurface: new THREE.Uniform(new THREE.Color(debugObject.colorWaterSurface)),
    uColorSand: new THREE.Uniform(new THREE.Color(debugObject.colorSand)),
    uColorGrass: new THREE.Uniform(new THREE.Color(debugObject.colorGrass)),
    uColorSnow: new THREE.Uniform(new THREE.Color(debugObject.colorSnow)),
    uColorRock: new THREE.Uniform(new THREE.Color(debugObject.colorRock))
}

const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    vertexShader: terrainVertex,
    fragmentShader: terrainFragment,
    uniforms: uniforms,

    color: '#85d534', 
    metalness: 0, 
    roughness: 0.5
})


const depthMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader: terrainVertex,
    uniforms: uniforms,

    depthPacking: THREE.RGBADepthPacking
})

const terrain = new THREE.Mesh(geometry, material)
terrain.customDepthMaterial = depthMaterial
terrain.receiveShadow = true
terrain.castShadow = true
scene.add(terrain)

gui.addColor(debugObject, 'colorWaterDeep').onChange(() => {
    uniforms.uColorWaterDeep.value.set(debugObject.colorWaterDeep)
})
gui.addColor(debugObject, 'colorWaterSurface').onChange(() => {
    uniforms.uColorWaterSurface.value.set(debugObject.colorWaterSurface)
})
gui.addColor(debugObject, 'colorSand').onChange(() => {
    uniforms.uColorSand.value.set(debugObject.colorSand)
})
gui.addColor(debugObject, 'colorGrass').onChange(() => {
    uniforms.uColorGrass.value.set(debugObject.colorGrass)
})
gui.addColor(debugObject, 'colorSnow').onChange(() => {
    uniforms.uColorSnow.value.set(debugObject.colorSnow)
})
gui.addColor(debugObject, 'colorRock').onChange(() => {
    uniforms.uColorRock.value.set(debugObject.colorRock)
})

// Water
const water = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 1, 1),
    new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0.3
    })
)
water.rotation.x = - Math.PI / 2;
water.position.y = - 0.1;
scene.add(water)

// Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(6.25, 3, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 30
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
scene.add(directionalLight)

const clock = new THREE.Clock()
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-10, 6, -2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()