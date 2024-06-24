import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const canvas = document.querySelector('canvas.webgl')
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const gltfLoader = new GLTFLoader()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const aspectRatio = sizes.width/sizes.height

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX/sizes.width * 2 - 1
    mouse.y = -(event.clientY/sizes.height) * 2 + 1

    //console.log(mouse)
})

window.addEventListener('click', () => {
    if(currentIntersect) {
        console.log('click')
        switch(currentIntersect.object) {
            case sphereMesh1:
                console.log('click on object 1')
                break

            case sphereMesh2:
                console.log('click on object 2')
                break
            
            case sphereMesh3:
                console.log('click on object 3')
                break        
        }
    }
})

const scene  = new THREE.Scene()

let duckObject = null
gltfLoader.load(
    './models/burger.glb', (gltf) => {
        duckObject = gltf.scene
        duckObject.position.y = -1.2
        console.log(duckObject)
        scene.add(duckObject)
    }
)

const sphereGeometry = new THREE.SphereGeometry(0.5,60,60)
const sphereMaterial1 = new THREE.MeshStandardMaterial({color: 'red'})
const sphereMaterial2 = new THREE.MeshStandardMaterial({color: 'red'})
const sphereMaterial3 = new THREE.MeshStandardMaterial({color: 'red'})


const sphereMesh1 = new THREE.Mesh(sphereGeometry, sphereMaterial1)
const sphereMesh2 = new THREE.Mesh(sphereGeometry, sphereMaterial2)
const sphereMesh3 = new THREE.Mesh(sphereGeometry, sphereMaterial3)


scene.add(sphereMesh1, sphereMesh2, sphereMesh3)
sphereMesh1.position.set(-2,0,0)
sphereMesh2.position.set(0,0,0)
sphereMesh3.position.set(2,0,0)

//Raycasting
// const rayOrigin  = new THREE.Vector3(-3,0,0)
// const rayDirection = new THREE.Vector3(10,0,0)
// rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(sphereMesh2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([sphereMesh1, sphereMesh2, sphereMesh3])
// console.log(intersects)



// Light
const light  = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(light)

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.set(-3,3,3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// // controls.enabled= false
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})


renderer.setSize(sizes.width, sizes.height)

renderer.setPixelRatio(window.devicePixelRatio)

const clock = new THREE.Clock()
let oldElapsedTime = 0

let currentIntersect = null

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const delta = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    //Animating object
    sphereMesh1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    sphereMesh2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    sphereMesh3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Raycasing
    // const rayOrigin  = new THREE.Vector3(-3,0,0)
    // const rayDirection = new THREE.Vector3(1,0,0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigin, rayDirection)
    
    // raycaster.setFromCamera(mouse, camera)

    // const objectToTest = [sphereMesh1, sphereMesh2, sphereMesh3]
    // const intersects = raycaster.intersectObjects(objectToTest)
    // console.log(intersects)

    // if(intersects.length) {
    //     if(!currentIntersect) {
    //         console.log('mouse enter')
    //     }
    //     currentIntersect = intersects[0]
    // }
    // else {
    //     if(currentIntersect) {
    //         console.log('mouse leave')
    //     }
    //     currentIntersect = null
    // }


    // for (const object of objectToTest) {
    //     object.material.color.set('red')
    // }

    // for (const intersect of intersects) {
    //     intersect.object.material.color.set('#0000ff')
    // }



    // Raycasting from mouse
    raycaster.setFromCamera(mouse, camera)
    
    const objectsToTest = [sphereMesh1, sphereMesh2, sphereMesh3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    
    if(intersects.length) {
        if (!currentIntersect) {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    }
    else {
        if(currentIntersect) {
            console.log('mouse leave')
        }

        currentIntersect = null
    }

    for(const intersect of intersects)
    {
        intersect.object.material.color.set('#0000ff')
    }

    for(const object of objectsToTest)
    {
        if(!intersects.find(intersect => intersect.object === object))
        {
            object.material.color.set('#ff0000')
        }
    }

    // Model Interaction
    if(duckObject) {
        const modelInteractions = raycaster.intersectObject(duckObject)
        if(modelInteractions.length) {
            duckObject.scale.set(0.4, 0.4, 0.4)
        }
        else {
            duckObject.scale.set(0.2, 0.2, 0.2)
        }
    }
    




    controls.update()

    renderer.render(scene,camera)

    window.requestAnimationFrame(tick)

}

tick()