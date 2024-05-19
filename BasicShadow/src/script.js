import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const aspectRatio = sizes.width/sizes.height

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

const scene  = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
bakedShadow.colorSpace = THREE.SRGBColorSpace;

const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
simpleShadow.colorSpace = THREE.SRGBColorSpace;

//console.log(simpleShadow)

const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshStandardMaterial({roughness: 0.7});
const sphereMesh = new THREE.Mesh(geometry, material);
sphereMesh.position.set(0, 0.65, 0)
sphereMesh.castShadow = true
scene.add(sphereMesh);


const planeMaterial = new THREE.MeshStandardMaterial({roughness: 0.9, side: THREE.DoubleSide});
// const planeMaterial = new THREE.MeshBasicMaterial({
//     map:bakedShadow,
//     side: THREE.DoubleSide
// });

const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(5,5), planeMaterial)
planeMesh.position.y = -0.4;
planeMesh.rotation.x = - Math.PI/2
planeMesh.receiveShadow = true
scene.add(planeMesh);


const sphereShadowMesh  = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)

sphereShadowMesh.rotation.x = - Math.PI * 0.5
sphereShadowMesh.position.y = planeMesh.position.y + 0.001

scene.add(sphereShadowMesh)

console.log(sphereShadowMesh)

const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00ffff, 1.3)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024    
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2

directionalLight.shadow.radius = 10

scene.add(directionalLight)
console.log(directionalLight.shadow)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)
directionalLightCameraHelper.visible = false



scene.add(directionalLight)
console.log(directionalLight.shadow)

const spotLight = new THREE.SpotLight(0xffffff, 1.3, 10, Math.PI*0.3);
spotLight.castShadow = true

spotLight.position.set(0,2,2);

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6



scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)
spotLightCameraHelper.visible = false

const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.castShadow = true;
pointLight.position.set(-1,1,0)
//scene.add(pointLight); 

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)

pointLightCameraHelper.visible = false


const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.z = 8
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDumping = true


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = false

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update the sphere
    sphereMesh.position.x = Math.cos(elapsedTime) * 1.5
    sphereMesh.position.z = Math.sin(elapsedTime) * 1.5
    sphereMesh.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update the shadow
    sphereShadowMesh.position.x = sphereMesh.position.x
    sphereShadowMesh.position.z = sphereMesh.position.z
    sphereShadowMesh.material.opacity = (1 - sphereMesh.position.y) * (0.6)


    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()





  