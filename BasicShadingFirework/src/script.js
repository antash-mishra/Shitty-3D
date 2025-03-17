import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader  from './shaders/fragment.glsl';
import { Sky } from 'three/examples/jsm/Addons.js';

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}
sizes.resolution = new THREE.Vector2(sizes.width, sizes.height);

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
    sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
})

// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1.5
camera.position.y = 0
camera.position.z = 6
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Texture
const textureLoader = new THREE.TextureLoader();
const textures = [
    textureLoader.load('./Particles/1.png'),
    textureLoader.load('./Particles/2.png'),
    textureLoader.load('./Particles/3.png'),
    textureLoader.load('./Particles/4.png'),
    textureLoader.load('./Particles/5.png'),
    textureLoader.load('./Particles/6.png'),
    textureLoader.load('./Particles/7.png'),
    textureLoader.load('./Particles/8.png')
]


// Sky
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const sun = new THREE.Vector3();

/// GUI

const skyController = {
	turbidity: 10,
	rayleigh: 3,
	mieCoefficient: 0.005,
	mieDirectionalG: 0.95,
	elevation: -2.2,
	azimuth: 180,
	exposure: renderer.toneMappingExposure
};

function updateSky() {

	const uniforms = sky.material.uniforms;
	uniforms[ 'turbidity' ].value = skyController.turbidity;
	uniforms[ 'rayleigh' ].value = skyController.rayleigh;
	uniforms[ 'mieCoefficient' ].value = skyController.mieCoefficient;
	uniforms[ 'mieDirectionalG' ].value = skyController.mieDirectionalG;

	const phi = THREE.MathUtils.degToRad( 90 - skyController.elevation );
	const theta = THREE.MathUtils.degToRad( skyController.azimuth );

	sun.setFromSphericalCoords( 1, phi, theta );

	uniforms[ 'sunPosition' ].value.copy( sun );

	renderer.toneMappingExposure = skyController.exposure;
	renderer.render( scene, camera );
}

gui.add( skyController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( updateSky );
gui.add( skyController, 'rayleigh', 0.0, 4, 0.001 ).onChange( updateSky );
gui.add( skyController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( updateSky );
gui.add( skyController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( updateSky );
gui.add( skyController, 'elevation', -3, 10, 0.01 ).onChange( updateSky );
gui.add( skyController, 'azimuth', - 180, 180, 0.1 ).onChange( updateSky );
gui.add( skyController, 'exposure', 0, 1, 0.0001 ).onChange( updateSky );

updateSky();



// Firework Geometry
const createFirework = (count, position, size, texture, radius, color) => {
    // Position Array
    const positionArray = new Float32Array(count * 3);
    const sizesArray = new Float32Array(count);
    const timeMultiplierArray = new Float32Array(count);

    for (let i=0; i<count; i++) {
        const i3 = i * 3;

        const spherical = new THREE.Spherical(
            radius * (0.75 + Math.random() * 0.25),
            // Math.acos(1 - 2 * Math.random()),
            Math.PI * Math.random(),
            2 * Math.PI * Math.random()
        );
        const position = new THREE.Vector3().setFromSpherical(spherical);

        positionArray[i3] = position.x;
        positionArray[i3 + 1] = position.y;
        positionArray[i3 + 2] = position.z;

        sizesArray[i] = Math.random();

        timeMultiplierArray[i] = 1 + Math.random();
    }
    
    // Geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3));
    geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1));
    geometry.setAttribute('aTimeMultiplier', new THREE.Float32BufferAttribute(timeMultiplierArray, 1));

    // Material
    texture.flipY = false;
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution),
            uTexture: new THREE.Uniform(texture),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0)
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    // Destroy firework
    const destroy = () => {
        console.log('destroy');
        scene.remove(firework);
        geometry.dispose();
        material.dispose();
    }

    // Animate
    gsap.to(material.uniforms.uProgress, {
        value: 1,
        duration: 3,
        ease: 'linear',
        onComplete: destroy
    });

    // Creating instance of firework
    const firework = new THREE.Points(geometry, material);
    firework.position.copy(position);
    scene.add(firework);

}

const createRandomFirework = () => {
    const count = 400 + Math.random() * 1000;

    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random(),
        (Math.random() - 0.5) * 2
    );

    const size = 0.1 + Math.random() * 0.1;

    const texture = textures[Math.floor(Math.random() * textures.length)];

    const radius = 0.5 + Math.random();

    const color = new THREE.Color()
    color.setHSL(Math.random(), 1, 0.7);

    createFirework(count, position, size, texture, radius, color);

}

createRandomFirework();

document.addEventListener('click', createRandomFirework)

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()