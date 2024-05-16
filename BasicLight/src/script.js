import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'

const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const aspectRatio = sizes.width/sizes.height

const gui = new GUI()

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

const sphereGeometry = new THREE.SphereGeometry(0.5, 32,32)
const sphereMaterial = new THREE.MeshStandardMaterial()
sphereMaterial.roughness = 0.4
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh.position.x = -1.5
scene.add(sphereMesh)


const cubeGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75,6,6,6)
const cubeMaterial = new THREE.MeshStandardMaterial({roughness:0.4})
const cubeMesh = new THREE.Mesh(cubeGeometry, sphereMaterial)
cubeMesh.position.x = 0
cubeMaterial.roughness = 0.4
scene.add(cubeMesh)

const torusGeometry = new THREE.TorusGeometry(0.3, 0.1, 32, 64)
const torusMaterial = new THREE.MeshStandardMaterial({roughness:0.4})
const torusMesh = new THREE.Mesh(torusGeometry, sphereMaterial)
torusMesh.position.x = 1.5
scene.add(torusMesh)


const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshStandardMaterial( {side: THREE.DoubleSide, roughness:0.4} );
const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
planeMesh.position.y = -0.65;
planeMesh.rotation.x = Math.PI/2
scene.add( planeMesh );


const camera = new THREE.PerspectiveCamera(75,aspectRatio)

camera.position.z = 3
scene.add(camera)

const light = new THREE.AmbientLight( 0xffffff, 2  ); // soft white light
//scene.add(light);

// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9)
// scene.add(directionalLight)
// directionalLight.position.set(1, 0.25, 0)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9)
//scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 1.5)
//scene.add(pointLight);
pointLight.position.set(-0.5, 0,1)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff,6, 1, 1)
rectAreaLight.position.set(-1.5,0,1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight);

const spotLight  = new THREE.SpotLight(0xf8ff00, 2, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0,2,3)
scene.add(spotLight)

spotLight.target.position.x = -0.75
scene.add(spotLight.target)

gui.add(light, 'intensity', 0, 3,0.0001)





// const pointLight = new THREE.PointLight(0xffffff, 50)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight) 

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

    // Update objects
    sphereMesh.rotation.y = 0.1 * elapsedTime
    cubeMesh.rotation.y = 0.1 * elapsedTime
    torusMesh.rotation.y = 0.1 * elapsedTime
    
    sphereMesh.rotation.x = 0.15 * elapsedTime
    cubeMesh.rotation.x = 0.15 * elapsedTime
    torusMesh.rotation.x = 0.15 * elapsedTime
    
    //mesh.rotation.y = elapsedTime
    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
