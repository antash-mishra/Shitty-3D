import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'
import CANNON, { ContactMaterial, Vec3 } from 'cannon'


const gui = new GUI()
const debugObject = {}

const hitSound = new Audio('/sounds/hit.mp3')
const playHitMusic = (collision) => {
    console.log(collision);

    const impact = collision.contact.getImpactVelocityAlongNormal()
    console.log(impact)
    if(impact > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')


const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase= new CANNON.SAPBroadphase(world)
world.allowSleep = true

const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction:0.1,
        restitution: 0.7
    }
)


world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// const sphereShape = new CANNON.Sphere(0.5)

// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(-2,2, -2),
//     shape: sphereShape,
//     material: defaultMaterial
// })

// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody);

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.material = defaultMaterial

floorBody.mass = 0
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
floorBody.addShape(floorShape)
world.addBody(floorBody)

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial( {side: THREE.DoubleSide, roughness:0.4} );
const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );

planeMaterial.color = new THREE.Color('#4E4D4B')

planeMesh.rotation.x = Math.PI/2
planeMaterial.roughness  = 0.4
planeMaterial.metalness = 0.3
planeMesh.receiveShadow = true

scene.add( planeMesh );

const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1,20,20)
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    metalness: 0.3, 
    roughness:0.4
})

const boxGeometry = new THREE.BoxGeometry(1,1,1)
const boxMaterial = new THREE.MeshStandardMaterial({ 
    metalness: 0.3, 
    roughness:0.4
})

const createSphere = (radius, position) => {
    
    //ThreeJS Mesh
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    )
    mesh.castShadow = true;
    mesh.scale.set(radius,radius,radius);
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon Body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0,3,0),
        shape:shape,
        material: defaultMaterial
    })

    body.position.copy(position);
    world.addBody(body);
    body.addEventListener('collide', playHitMusic)

    // Save object to update
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}



const createBox = (width,height,depth,position) => {
    
    //ThreeJS Mesh
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    )
    mesh.castShadow = true;
    mesh.scale.set(width,height,depth);
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon Body
    const shape = new CANNON.Box(new CANNON.Vec3(width*0.5, height*0.5, depth*0.5))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0,3,0),
        shape:shape,
        material: defaultMaterial
    })

    body.position.copy(position);
    world.addBody(body);
    body.addEventListener('collide', playHitMusic)
    // Save object to update
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3, 
            y:3, 
            z: (Math.random() - 0.5) * 3
        }
    );
}

createBox(1,1.5,2, {x:0, y:3, z:0})

debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3, 
            y:3, 
            z: (Math.random() - 0.5) * 3
        }
    );
}

debugObject.reset = () => {
    for(const object of objectsToUpdate) {
        // Remove Body
        object.body.removeEventListener('collide', playHitMusic)
        world.removeBody(object.body)

        // Remove Mesh
        scene.remove(object.mesh)
    }
    objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')
// const sphereMesh = new THREE.Mesh(
//     sphereGeometry,
//     sphereMaterial
// )
// sphereMaterial.roughness  = 0.4
// sphereMaterial.metalness = 0.3
// sphereMesh.position.set(-2,2, -2)
// sphereMesh.castShadow = true
// scene.add(sphereMesh)

// Light
const light = new THREE.AmbientLight( 0xffffff, 2.1  );
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)
directionalLightCameraHelper.visible = true

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(- 3, 3, 3)
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
// // controls.enabled= false
controls.enableDamping = true


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

// Shadow Configuration
//renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setSize(sizes.width, sizes.height)

// To remove blurry pixel
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))


const clock = new THREE.Clock()
let oldElapsedTime = 0;

const tick = ()  => {

    const elapsedTime = clock.getElapsedTime()
    const delta = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime;

    controls.update()

    // Update Physics
    // sphereBody.applyForce(new CANNON.Vec3(-0.5,0,0), sphereBody.position)

    world.step(1/60, delta, 3)
    // console.log(sphereBody.position.y)

    // sphereMesh.position.x = sphereBody.position.x
    // sphereMesh.position.y = sphereBody.position.y
    // sphereMesh.position.z = sphereBody.position.z

    // sphereMesh.position.copy(sphereBody.position);

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    renderer.render(scene,camera)

//    console.log(deltaTime)

    window.requestAnimationFrame(tick)
}

tick()
