import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import typeFaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import GUI from 'lil-gui'

const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const aspectRatio = sizes.width / sizes.height

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

const matcapTexture = textureLoader.load('/textures/matcaps/2.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

// Fonts
const fontLoader = new FontLoader()

// Initiate TextMesh
const textMesh = new THREE.Mesh()

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {

    const initialParameters = {
        font: font,
        size: 0.7,
        depth: 0.1,
        curveSegments: 10, 
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.002,
        bevelOffset: 0,
        bevelSegments: 5
    }
    const textGeo = new TextGeometry(
        'I am Shit!',
        initialParameters
    )
    textGeo.computeBoundingBox()
    // textGeo.translate(
    //     - (textGeo.boundingBox.max.x - initialParameters.bevelSize) * 0.5,
    //     - (textGeo.boundingBox.max.y - initialParameters.bevelSize) * 0.5
    //     - (textGeo.boundingBox.max.z - initialParameters.bevelThickness) * 0.5
    // )
    console.log(textGeo.boundingBox.max.z - initialParameters.bevelThickness)

    textGeo.translate(
        - (textGeo.boundingBox.max.x - initialParameters.bevelSize) * 0.5,
        - (textGeo.boundingBox.max.y - initialParameters.bevelSize) * 0.5,
        - (textGeo.boundingBox.max.z - initialParameters.bevelThickness) * 0.5
    )
    textMesh.geometry = textGeo
    textMesh.material = new THREE.MeshMatcapMaterial({matcap: matcapTexture ,wireframe: false})  
    // new THREE.Mesh(
    //     textGeo,
    //     new THREE.MeshMatcapMaterial({matcap: matcapTexture ,wireframe: false})
    // )

        // .onChange(() => {
        //     textGeo.dispose();
        //     textGeo.parameters.options.curveSegments = debugObject.
        // })
    scene.add(textMesh)
    //gui.add(textGeo, 'bevelSegments').min(0).max(50).step(1)
    
    const donutGeometry = new THREE.TorusGeometry(0.3,0.2, 20, 45)
    const coneGeometry = new THREE.ConeGeometry(0.3,0.5)
    const BoxGeometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 )
    const SphereGeometry = new THREE.SphereGeometry(0.2, 16,8)
    const donutMaterial = new THREE.MeshNormalMaterial()


    RandomizeMesh(donutGeometry, donutMaterial);
    RandomizeMesh(coneGeometry, donutMaterial);
    RandomizeMesh(BoxGeometry, donutMaterial);
    RandomizeMesh(SphereGeometry, donutMaterial);

})

const scene = new THREE.Scene()

// const mesh = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1,5,5,5),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(mesh)

const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()

    const radius = 3; // Adjust as needed
    const angle = elapsedTime * 0.1; // Adjust speed of rotation
    const cameraX = Math.sin(angle) * radius;
    const cameraZ = Math.cos(angle) * radius;
    camera.position.set(cameraX, 0, cameraZ);
    camera.lookAt(scene.position); 

    textMesh.rotation.y = angle;

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()


function RandomizeMesh(geometry, material) {
    for (let i=0; i< 100; i++) {
        
        const donutMesh = new THREE.Mesh(geometry,material)
        donutMesh.position.x = (Math.random() - 0.5) * 10
        donutMesh.position.y = (Math.random() - 0.5) * 10
        donutMesh.position.z = -(Math.random() - 0.5) * 10

        donutMesh.rotation.x = Math.random() * Math.PI
        donutMesh.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        donutMesh.scale.set(scale,scale, scale)
        scene.add(donutMesh)
    }
    
}
