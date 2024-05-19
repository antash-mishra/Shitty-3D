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


window.addEventListener('resize', (event) => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera
    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()
    console.log("window has been resized")

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

window.addEventListener('dblclick', () => {

    //const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    }
    else {
        document.exitFullscreen()
    }
})


const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
doorColorTexture.colorSpace = THREE.SRGBColorSpace

const wallTexture = textureLoader.load('/textures/background-made-from-bricks.jpg')
wallTexture.colorSpace = THREE.SRGBColorSpace

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
grassColorTexture.colorSpace = THREE.SRGBColorSpace

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping


grassColorTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

const alleywayAmbientOcclusionTexture = textureLoader.load('/textures/alleyway/ambientOcclusion.jpg')
const alleywayColorTexture = textureLoader.load('/textures/alleyway/color.jpg')
const alleywayHeightTexture = textureLoader.load('/textures/alleyway/height.jpg')
const alleywayRoughnessTexture = textureLoader.load('/textures/alleyway/roughness.jpg')
const alleywayNormalTexture = textureLoader.load('/textures/alleyway/normal.jpg')
alleywayColorTexture.colorSpace = THREE.SRGBColorSpace

console.log(alleywayAmbientOcclusionTexture)
console.log(alleywayColorTexture)
console.log(alleywayHeightTexture)
console.log(alleywayRoughnessTexture)
console.log(alleywayNormalTexture)

alleywayColorTexture.wrapS = THREE.RepeatWrapping
alleywayAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
alleywayNormalTexture.wrapS = THREE.RepeatWrapping
alleywayRoughnessTexture.wrapS = THREE.RepeatWrapping
alleywayHeightTexture.wrapS = THREE.RepeatWrapping

alleywayColorTexture.wrapT = THREE.RepeatWrapping
alleywayAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
alleywayNormalTexture.wrapT = THREE.RepeatWrapping
alleywayRoughnessTexture.wrapT = THREE.RepeatWrapping
alleywayHeightTexture.wrapT = THREE.RepeatWrapping


alleywayColorTexture.repeat.set(1,6)
alleywayAmbientOcclusionTexture.repeat.set(1,6)
alleywayNormalTexture.repeat.set(1,6)
alleywayRoughnessTexture.repeat.set(1,6)
alleywayHeightTexture.repeat.set(1,6)

const graveAmbientOcclusionTexture = textureLoader.load('/textures/alleyway/drive-download-20240519T194549Z-001/Concrete_Muddy_001_AmbientOcclusion.jpg')
const graveColorTexture = textureLoader.load('/textures/alleyway/drive-download-20240519T194549Z-001/Concrete_Muddy_001_BaseColor.jpg')
const graveHeightTexture = textureLoader.load('/textures/alleyway/drive-download-20240519T194549Z-001/Concrete_Muddy_001_Height.jpg')
const graveRoughnessTexture = textureLoader.load('/textures/alleyway/drive-download-20240519T194549Z-001/Concrete_Muddy_001_Roughness.jpg')
const graveNormalTexture = textureLoader.load('/textures/alleyway/drive-download-20240519T194549Z-001/Concrete_Muddy_001_Normal.jpg')
graveColorTexture.colorSpace = THREE.SRGBColorSpace



const scene = new THREE.Scene()



// Ground
const planeGeometry = new THREE.PlaneGeometry(18,18)
const planeMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide, 
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    roughnessMap: grassRoughnessTexture,
    normalMap: grassNormalTexture
})

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.rotation.x = - Math.PI/2
planeMesh.receiveShadow = true
scene.add(planeMesh);

const allyway = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 10),
    new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        map: alleywayColorTexture,
        aoMap: alleywayAmbientOcclusionTexture,
        roughnessMap: alleywayRoughnessTexture,
        normalMap: alleywayNormalTexture,
        displacementScale: 1,
        displacementMap: alleywayHeightTexture
    })
)
allyway.position.y = 0.01
allyway.position.z = 4.0

allyway.rotation.x = - Math.PI/2
allyway.receiveShadow = true
scene.add(allyway);



// const sphereGeometry = new THREE.SphereGeometry(0.5, 32,32);
// const sphereMaterial = new THREE.MeshStandardMaterial({
//     color: 0xffffff, 
//     roughness: 0.7
// });

// const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
// sphereMesh.position.y = 0.2
// scene.add(sphereMesh)


// House
const house = new THREE.Group()
scene.add(house);

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallTexture
    })
)
walls.position.y = 1.25
house.add(walls)
walls.castShadow = true

// Roofs
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({color: '#b35f45'})
)

roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5+0.5
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)


// Bushes
const busGeometry = new THREE.SphereGeometry(1, 16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})

const bush1 = new THREE.Mesh(busGeometry, bushMaterial);
bush1.scale.set(0.5,0.5,0.5);
bush1.position.set(0.8,0.2,2.2);
house.add(bush1);
bush1.castShadow = true


const bush2 = new THREE.Mesh(busGeometry, bushMaterial);
bush2.scale.set(0.25,0.25,0.25);
bush2.position.set(1.4,0.1,2.1);
house.add(bush2);
bush2.castShadow = true

const bush3 = new THREE.Mesh(busGeometry, bushMaterial);
bush3.scale.set(0.4,0.4,0.4);
bush3.position.set(-0.8,0.1, 2.2);
house.add(bush3);
bush3.castShadow = true

const bush4 = new THREE.Mesh(busGeometry, bushMaterial);
bush4.scale.set(0.15,0.15,0.15);
bush4.position.set(-1,0.05,2.6);
house.add(bush4);
bush4.castShadow = true

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveAmbientOcclusionTexture,
    roughnessMap: graveRoughnessTexture,
    normalMap: graveNormalTexture,
    displacementScale: 0.1,
    displacementMap: graveHeightTexture
})

const placedGraves = [];
const minDistance = 1.5; 

function isFarEnough(newPosition) {
    for (const grave of placedGraves) {
      const distance = Math.sqrt(
        (newPosition.x - grave.x) ** 2 +
        (newPosition.z - grave.z) ** 2
      );
      if (distance < minDistance) {
        return false;
      }
    }
    return true;
  }
  

// for (let i=0; i<50; i++){
//     const angle = Math.random() * Math.PI * 2
//     const radius = 3 + Math.random() * 6
//     const x = Math.cos(angle) * radius
//     const z = Math.sin(angle) * radius


//     const grave = new THREE.Mesh(graveGeometry, graveMaterial);

//     grave.position.set(x, 0.3, z)

//     grave.rotation.z = (Math.random() - 0.5) * 0.4
//     grave.rotation.y = (Math.random() - 0.5) * 0.4

//     graves.add(grave)
//     grave.castShadow = true
// }

for (let i = 0; i < 50; i++) {
    let position;
    let tries = 0;
    const maxTries = 100; // Limit the number of tries to avoid infinite loops
  
    do {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      position = { x, z };
      tries++;
    } while (!isFarEnough(position) && tries < maxTries);
  
    if (tries < maxTries) {
      placedGraves.push(position);
      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(position.x, 0.3, position.z);
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      graves.add(grave);
      grave.castShadow = true;
    }
}
  


const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.26)
directionalLight.position.set(2,2,-1)
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256

directionalLight.shadow.mapSize.far = 7

directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2



scene.add(directionalLight)
directionalLight.castShadow = true

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(directionalLightHelper)
directionalLightHelper.visible = false

const doorLight = new THREE.PointLight('#ff7d46', 3,7)
house.add(doorLight)
doorLight.castShadow = true

doorLight.position.z = 2.7
doorLight.position.y = 2.2

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

const doorLightHelper = new THREE.PointLightHelper(doorLight, 5)
house.add(doorLightHelper)
doorLightHelper.visible = false

//fog
const fog = new THREE.Fog('#262837', 0.7, 15)
scene.fog = fog

// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 6, 3)
scene.add(ghost1)
ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

const ghost2 = new THREE.PointLight('#ff00ff', 6, 3)
scene.add(ghost2)
ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

const ghost3 = new THREE.PointLight('#ff00ff', 6, 3)
scene.add(ghost3)
ghost3.castShadow = true

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

const camera = new THREE.PerspectiveCamera(75, aspectRatio)
camera.position.set(6,2, 8)

console.log(camera.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDumping = true


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#262837')

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio, 2)

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    controls.update();

    // Ghosts
    const ghost1Angle = elapsedTime*0.5
    
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime*0.32

    ghost2.position.x = Math.cos(ghost2Angle) * 4
    ghost2.position.z = Math.sin(ghost2Angle) * 4
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.cos(elapsedTime * 4) * Math.sin(elapsedTime * 2.5)

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()