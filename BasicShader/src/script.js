// import * as THREE from 'three'
// import './style.css'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


// const canvas = document.querySelector('canvas.webgl');

// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// const aspectRatio = sizes.width/sizes.height;

// window.addEventListener('resize', (event) => {

//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update Camera
//     camera.aspect = sizes.width/sizes.height
//     camera.updateProjectionMatrix()
//     console.log("window has been resized")

//     // Update Renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
// })

// window.addEventListener('dblclick', () => {

//     //const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

//     if (!document.fullscreenElement) {
//         canvas.requestFullscreen()
//     }
//     else {
//         document.exitFullscreen()
//     }
// })

// const scene = new THREE.Scene();
// const clock = new THREE.Clock();

// var geometry = new THREE.PlaneGeometry(2,2);

// const uniforms = {
//     u_time: {type: "f", value: 1.0},
//     u_resolution: {type: "v2", value: new THREE.Vector2()},
//     u_mouse: {type: "v2", value: new THREE.Vector2() }
// };

// var material = new THREE.ShaderMaterial({
//     uniforms,
//     vertexShader: document.getElementById('vertexShader').textContent,
//     fragmentShader: document.getElementById('fragmentShader').textContent
// });

// var mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// const camera = new THREE.PerspectiveCamera(75, aspectRatio)
// camera.position.z = 1
// scene.add(camera)

// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas
// })

// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio( window.devicePixelRatio );

// document.onmousemove = function(e){
//     uniforms.u_mouse.value.x = e.pageX
//     uniforms.u_mouse.value.y = e.pageY
// }

// const tick = () => {
//     const elapsedTime = clock.getElapsedTime()
//     uniforms.u_time.value += clock.getDelta();


//     camera.lookAt(scene.position); 


//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
// }

// tick()  