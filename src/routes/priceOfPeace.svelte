<script>
import '../global.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { mapLinear } from 'three/src/math/MathUtils'
import  gsap from 'gsap';

let progressRatio

setTimeout(() => {
    


/**
 * Loaders
 */

const loadingBarElement = document.getElementById('loading')
const loadingPercent = document.getElementById('num')

console.log(loadingBarElement)



const loadingManager = new THREE.LoadingManager(
    
    //Loaded
    () =>
    {
        gsap.delayedCall(1, () =>
    {
        gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
        loadingBarElement.classList.add('ended')
        loadingBarElement.style.transform = ''
        //loadingPercent.style.color = '#00000000'
  
        
    })
    },

    //Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        progressRatio =  itemsLoaded / itemsTotal 
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
        // gsap.to(loadingBarElement, { width: '${progressRatio * 100}vw', duration: 0.1})
        console.log(progressRatio)
    }
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

// const loader = new THREE.ObjectLoader();

// loader.load(
// 	// resource URL
// 	"/src/assets/models/json/particlesExp3.json",

// 	// onLoad callback
// 	// Here the loaded data is assumed to be an object
// 	function ( obj ) {
// 		// Add the loaded object to the scene
// 		scene.add( obj );
// 	},

// 	// onProgress callback
// 	function ( xhr ) {
// 		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
// 	},

// 	// onError callback
// 	function ( err ) {
// 		console.error( 'An error happened' );
// 	}
// );

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


const bombG = new THREE.Group()
scene.add(bombG)

const labelG = new THREE.Group()
scene.add(labelG)

/**
 * Models
 */
gltfLoader.load(
    '/assets/models/bombSmiley.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(1, 1, 1)
        gltf.scene.position.set(0, -2, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        bombG.add(gltf.scene)
        updateAllMaterials()
    
    }
   
)

gltfLoader.load(
    '/assets/models/bombLabel.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(1, 1, 1)
        gltf.scene.position.set(0, -2, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        labelG.add(gltf.scene)
        
        bombG.add(labelG)
        
        updateAllMaterials()
    
    }
   
)
gsap.registerPlugin()

gsap.from(labelG.rotation, {
    duration: 0.2,
    y:  (Math.PI * 0.1),
    repeat:-1
});

gsap.to(labelG.rotation, {
    duration: 0.2,
    y:  (Math.PI * 0.1),
    repeat:-1
});

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000);
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
controls.autoRotate = true
controls.autoRotateSpeed = -3   


/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // Update controls
    controls.update()
    
    bombG.rotation.y = elapsedTime * 0.1

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

}, 1);
</script>

<canvas class="webgl"></canvas>
<div id="loading" class="loading-bar"></div>


