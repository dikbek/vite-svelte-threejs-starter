<script>
import '../global.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { mapLinear } from 'three/src/math/MathUtils'
import  gsap from 'gsap';



setTimeout(() => {
    

/**
 * Loaders
 */

const loadingBarElement = document.querySelector('.loading-bar')
console.log(loadingBarElement)

const loadingManager = new THREE.LoadingManager(
    
    //Loaded
    () =>
    {
        gsap.delayedCall(1, () =>
    {
        gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
        loadingBarElement.classList.add('ended')
        //loadingBarElement.style.transform = ''
    })
    },

    //Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        const progressRatio =  itemsLoaded / itemsTotal 
        //loadingBarElement.style.transform = `scaleX(${progressRatio})`
        //console.log(progressRatio)
    }
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)



/**
 * Base
 */
// Debug
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//overlay

const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial( {
    transparent: true,
    uniforms: 
    {
        uAlpha: { value: 2 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
    uniform float uAlpha;
        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)


/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/assets/images/environmentMaps/0/px.png',
    '/assets/images/environmentMaps/0/nx.png',
    '/assets/images/environmentMaps/0/py.png',
    '/assets/images/environmentMaps/0/ny.png',
    '/assets/images/environmentMaps/0/pz.png',
    '/assets/images/environmentMaps/0/nz.png'
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 5

//Gltf

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/assets/draco/') // draco file copied  from node modules to /static

gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
//scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(4, 1, - 4)
scene.add(camera)



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, renderer.domElement )
controls.enableDamping = true
controls.enablePan = false
controls.minDistance = 2
controls.maxDistance = 4
//controls.enableZoom = false
controls.dampingFactor = 0.05
controls.minPolarAngle = Math.PI / 3
controls.maxPolarAngle =  Math.PI / 1.5
// controls.minAzimuthAngle = - Math.PI / 3
// controls.maxAzimuthAngle = Math.PI / 3
/**



/**
 * Animate
 */

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

}, 1);
</script>

<canvas class="webgl"></canvas>
<div class="loading-bar"></div>

<style>
    *
{
    margin: 0;
    padding: 0;
    overflow: hidden;
}


.webgl
{
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
}

.loading-bar 
{
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    background: #ffffff;
    transform: scaleX(0);
    transform-origin: top left;
    transition: transform 0.5s;
    will-change: transform;
}

.loading-bar.ended
{

    transform-origin: top right;
    transition: transform 1.5s ease-in-out;

}

</style>