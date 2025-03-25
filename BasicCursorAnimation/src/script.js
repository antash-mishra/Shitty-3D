import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'
import { texture } from 'three/tsl'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const textureLoader = new THREE.TextureLoader()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
    
    // Materials
    particleMaterial.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    // Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)

})

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 18)
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // alpha: true,
    antialias: true
})
renderer.setClearColor('#181818')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

// Displacement
const displacement = {}
displacement.canvas = document.createElement('canvas')
displacement.canvas.width = 128
displacement.canvas.height = 128
displacement.canvas.style.position = 'fixed'
displacement.canvas.style.width = ' 256px'
displacement.canvas.style.height = '256px'
displacement.canvas.style.top = 0
displacement.canvas.style.left = 0
displacement.canvas.style.zIndex = 10
displacement.canvas.style.opacity = 0.0 
document.body.append(displacement.canvas)
displacement.texture = new THREE.CanvasTexture(displacement.canvas)

// COntext
displacement.context = displacement.canvas.getContext('2d')
displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

// Add image
displacement.glowImage = new Image()
displacement.glowImage.src = './glow.png'


// Particles
const particleGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)
particleGeometry.setIndex(null)
particleGeometry.deleteAttribute('normal')

const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uPictureTexture: new THREE.Uniform(textureLoader.load('./picture-4.png')),
        uDisplacementTexture: new THREE.Uniform(displacement.texture)
    },
    blending: THREE.AdditiveBlending
})

const particles = new THREE.Points(particleGeometry, particleMaterial)

const intensitiesArray = new Float32Array(particleGeometry.attributes.position.count)
const anglesArray = new Float32Array(particleGeometry.attributes.position.count)

for (let i = 0; i < intensitiesArray.length; i++) {
    intensitiesArray[i] = Math.random()
    anglesArray[i] = Math.random() * Math.PI * 2
}
particleGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
particleGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1))


scene.add(particles)

// Interactive Plane
displacement.interactivePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
        color: 'red',
        side: THREE.DoubleSide
    })
)
displacement.interactivePlane.visible = false
scene.add(displacement.interactivePlane)


// Raycaster
displacement.raycaster = new THREE.Raycaster();

// Mosue Coordinates
displacement.screenCursor = new THREE.Vector2(9999, 9999)
displacement.canvasCursor = new THREE.Vector2(9999, 9999)
displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999)


window.addEventListener('mousemove', (event) => {
    displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1
    displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1
})



// Animate
const tick = () => {
    controls.update()

    // Raycaster
    displacement.raycaster.setFromCamera(displacement.screenCursor, camera)
    const intersects = displacement.raycaster.intersectObject(displacement.interactivePlane)
    if (intersects.length) {
        const uv = intersects[0].uv
        displacement.canvasCursor.x = uv.x * displacement.canvas.width;
        displacement.canvasCursor.y = (1.0 - uv.y) * displacement.canvas.height;
        
    }

    // Fade Out
    displacement.context.globalCompositeOperation = 'source-over'
    displacement.context.globalAlpha = 0.02
    displacement.context.fillRect(0,0, displacement.canvas.width, displacement.canvas.height)

    // Speed Alpha
    const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor)
    displacement.canvasCursorPrevious.copy(displacement.canvasCursor)
    const alpha = Math.min(cursorDistance * 0.1, 1.0)
    

    // Draw Glow on displacement canvas
    const glowSize = displacement.canvas.width * 0.25
    displacement.context.globalCompositeOperation = 'lighten'
    displacement.context.globalAlpha = alpha
    displacement.context.drawImage(
        displacement.glowImage,
        displacement.canvasCursor.x - glowSize * 0.5,
        displacement.canvasCursor.y - glowSize * 0.5,
        glowSize,
        glowSize
    )

    // Displacement texture update
    displacement.texture.needsUpdate = true
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()



