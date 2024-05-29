import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import  GUI from 'lil-gui'


const canvas = document.querySelector('canvas.webgl')

let sizes = {
    width: window.innerWidth,
    height: innerHeight
}

const aspectRatio = sizes.width/sizes.height

const scene = new THREE.Scene()
const gui = new GUI()

const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.z = 3
scene.add(camera);

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

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)


const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 5
parameters.branches  = 3
parameters.spin = 1
parameters.randomness =0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

const geometry = new THREE.BufferGeometry()

const material = new THREE.PointsMaterial({
    size:parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

const points = new THREE.Points(geometry, material);

const galaxyGenerator = () => {

    if(points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    const vertices = new Float32Array(parameters.count*3)
    const colors = new Float32Array(parameters.count * 3)
    const colorsInside = new THREE.Color(parameters.insideColor)
    const colorsOutside = new THREE.Color(parameters.outsideColor)
    
    for (let i=0; i<parameters.count; i++) {
        const i3 = i*3

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random()<0.5 ? 1:-1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random()<0.5 ? 1:-1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random()<0.5 ? 1:-1) * parameters.randomness * radius

        vertices[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        vertices[i3+1] = randomY
        vertices[i3+2] = Math.sin(branchAngle + spinAngle) * radius  + randomZ

        const mixedColor = colorsInside.clone()
        mixedColor.lerp(colorsOutside, radius/parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3+1] = mixedColor.g
        colors[i3+2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    scene.add(points);


}

galaxyGenerator();

gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(galaxyGenerator)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(galaxyGenerator)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(galaxyGenerator)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(galaxyGenerator)
gui.addColor(parameters, 'insideColor').onFinishChange(galaxyGenerator)
gui.addColor(parameters, 'outsideColor').onFinishChange(galaxyGenerator)

const controls = new OrbitControls(camera, canvas)
controls.enableDumping = true;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick();