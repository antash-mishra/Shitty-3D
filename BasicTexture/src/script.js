import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'


//const image = new Image()

const gui = new GUI()

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
const colorTexture = textureLoader.load('/textures/door/color.jpg')
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.minFilter = THREE.NearestFilter
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/8.png')

// image.onload = () => {

//     texture.needsUpdate = true
//     console.log(texture)
// }


const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()


const geometry = new THREE.BoxGeometry(1,1,1,5,5,5)
const material = new THREE.MeshBasicMaterial()
material.map = colorTexture
// material.transparent = true
// material.opacity = 0.1
//material.map = colorTexture
//material.color = new THREE.Color('#ff0000')


const mesh = new THREE.Mesh(geometry, material)

// Normal Material
//const materialToast = new THREE.MeshNormalMaterial()

// Matcap Material
// const materialToast = new THREE.MeshMatcapMaterial()
// materialToast.matcap = matcapTexture
// materialToast.transparent = true
// materialToast.opacity = 0.5
// materialToast.alphaMap = alphaTexture
//material.flatShading = true

// Depth Material
//const materialToast = new THREE.MeshDepthMaterial()

// Lambert Material
//const materialToast = new THREE.MeshLambertMaterial()

// Mesh Phong Material
// const materialToast = new THREE.MeshPhongMaterial()
// materialToast.shininess = 100
// materialToast.specular = new THREE.Color(0x1128ff)

// Standard Mesh Material
// const materialToast = new THREE.MeshStandardMaterial()
// materialToast.roughness = 1
// materialToast.metalness = 1
// materialToast.map = colorTexture
// materialToast.aoMap = ambientOcclusionTexture
// materialToast.displacementMap = heightTexture
// materialToast.displacementScale = 0.1
// materialToast.metalnessMap = metalnessTexture
// materialToast.roughnessMap = roughnessTexture
// materialToast.normalMap = normalTexture
// materialToast.normalScale.set(0.1,0.1)
// materialToast.transparent = true
// materialToast.alphaMap = alphaTexture

// Physical Mesh Material
const materialToast = new THREE.MeshPhysicalMaterial()
materialToast.roughness = 0
materialToast.metalness = 0
// materialToast.map = colorTexture
// materialToast.aoMap = ambientOcclusionTexture
// materialToast.displacementMap = heightTexture
// materialToast.displacementScale = 0.1
// materialToast.metalnessMap = metalnessTexture
// materialToast.roughnessMap = roughnessTexture
// materialToast.normalMap = normalTexture
// materialToast.normalScale.set(0.1,0.1)
// materialToast.transparent = true
// materialToast.alphaMap = alphaTexture
// materialToast.clearcoat = 1
// materialToast.clearcoatRoughness = 0

// Iridescence
// materialToast.iridescence = 1
// materialToast.iridescenceIOR = 1
// materialToast.iridescenceThicknessRange = [100, 800]

// Transmission
materialToast.transmission = 1
materialToast.ior = 0.5
materialToast.thickness = 0.5

gui.add(materialToast, 'roughness').min(0).max(1).step(0.001)
gui.add(materialToast, 'metalness').min(0).max(1).step(0.001)
// gui.add(materialToast, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(materialToast, 'clearcoatRoughness').min(0).max(1).step(0.0001)
// gui.add(materialToast, 'iridescence').min(0).max(1).step(0.0001)
// gui.add(materialToast, 'iridescenceIOR').min(1).max(2.333).step(0.0001)
// gui.add(materialToast.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(materialToast.iridescenceThicknessRange, '1').min(1).max(1000).step(1)
gui.add(materialToast, 'transmission').min(0).max(1).step(0.0001)
gui.add(materialToast, 'ior').min(1).max(10).step(0.0001)
gui.add(materialToast, 'thickness').min(0).max(1).step(0.0001)


const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,64,64), 
    materialToast
)
sphereMesh.position.x = -1.5

const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1, 100,100),
    materialToast    
)

const torusMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    materialToast
)
torusMesh.position.x = 1.5


scene.add(sphereMesh, planeMesh, torusMesh)

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight) 

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight) 

// Environment Map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environmentMap) => {
    console.log(environmentMap)

    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})


const aspectRatio = sizes.width/sizes.height

const camera = new THREE.PerspectiveCamera(75, aspectRatio)

camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
    //mesh.rotation.y = elapsedTime
    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()