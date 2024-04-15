import * as THREE from 'three'



// Canvas
const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: 800,
    height: 600
}


// Scene
const scene = new THREE.Scene()


// Group
const group = new THREE.Group()

// Object
// const geometry = new THREE.BoxGeometry(1,1,1) // Geometry
// const material = new THREE.MeshBasicMaterial({color: 0xff0000 }) // Material
// const mesh = new THREE.Mesh(geometry, material) // Mesh
// mesh.position.x = 0.7
// mesh.position.y = -0.6
// mesh.position.z = 1
// mesh.position.set(0.7,-0.6,1)
// mesh.scale.set(2,0.25,0.5)
// mesh.rotation.reorder('YXZ')
// mesh.rotation.x = Math.PI *0.25
// mesh.rotation.y  = Math.PI *0.25

group.position.y = 1
scene.add(group)

const cube1  = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xff0000 }))
group.add(cube1)

const cube2  = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0x00ff00 }))
cube2.position.x = 1.5
group.add(cube2)

const cube3  = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0x0000ff }))
cube3.position.x = -1.5
group.add(cube3)
//AxesHelper
const axesHelper = new THREE.AxesHelper(1)
scene.add(axesHelper)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.z = 3
//camera.lookAt(mesh.position)
scene.add(camera)


// console.log(mesh.position.distanceTo(camera.position))

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene,camera)



console.log(THREE)