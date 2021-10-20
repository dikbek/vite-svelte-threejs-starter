<script>
    import '../global.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import { NoToneMapping } from 'three'

gsap.registerPlugin(ScrollTrigger)

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
        loadingPercent.style.color = '#00000000'
        
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
    


/**
 * Base
 * 
 */
// Debug
const gui = new dat.GUI({ closed: true, width: 400 })
const debugObject = {}



// Canvas
const canvas = document.querySelector('canvas.webgl')

//Mouse define 

let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / windowHalfX;
    mouseY = ( event.clientY - windowHalfY ) / windowHalfY;
    //console.log(mouseX, mouseY)
}


document.addEventListener( 'mousemove', onDocumentMouseMove );

//touch

function touchEventHandler(e) {
    var touchObj = e.changedTouches[0];
    mouseX = - ( touchObj.clientX - windowHalfX ) / windowHalfX;
    mouseY = ( touchObj.clientY - windowHalfY ) / windowHalfY;
    e.preventDefault()
}

document.addEventListener('touchstart', touchEventHandler);
document.addEventListener('touchmove', touchEventHandler);
document.addEventListener('touchend', touchEventHandler);


// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x051122);

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


//Axes Helper

const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

//Light

const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(0.2, 2.25, 10)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

const directionalLight2 = new THREE.DirectionalLight('#ffffff', 1)
directionalLight2.position.set(0.2, 1, -5)
directionalLight2.castShadow = true
directionalLight2.shadow.camera.far = 15
directionalLight2.shadow.mapSize.set(1024, 1024)
directionalLight2.shadow.normalBias = 0.05
scene.add(directionalLight2)

//const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//scene.add(directionalLightCameraHelper)


gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')


/**
 * Update all mAterials
 */

 const updateAllMaterials = () =>
 {
     scene.traverse((child) => 
     {
         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
         {
             //child.material.envMap = environmentMap
             child.material.envMapIntensity = debugObject.envMapIntensity
             child.material.needsUpdate = true
             child.castShadow = true
             child.receiveShadow = true
             
         }
         //console.log(child)
     })
 }


//Gltf

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/') // draco file copied  from node modules to /static

const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)


const bass = new THREE.Group()
scene.add(bass)

//   models in static folder
gltfLoader.load(
    '/assets/models/bass.gltf',
    (gltf) =>
    {
    bass.add(gltf.scene)
    gltf.scene.position.x = -11
    }
    
)
bass.rotation.x = Math.PI * 0.5
//bass.position.z = - 10;
//bass.position.x = - - 15


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
const cameraWheel = new THREE.Group()
scene.add (cameraWheel)
cameraWheel.rotation.y = - Math.PI / 2
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 22
camera.position.y = 0
cameraWheel.add(camera)

gsap.to(
    cameraWheel.rotation, 
    { ScrollTrigger: {
        trigger: cameraWheel.rotation,
        start: top,
        end: top,
        scrub: 1,
    },
    y: Math.PI/2,
    duration: 3

    
    }
 )

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.minDistance = 4
// controls.maxDistance = 200

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
    
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap



gui
    .add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
.onFinishChange(() => 
{
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    cameraWheel.rotation.y = ( 500 * mouseX - camera.position.x) * 0.003;
	cameraWheel.rotation.x = ( 200 * mouseY - camera.position.y  * 15) * 0.005 ;
    
    //taken from planet scene - slow ease
    //camera.position.x += ( mouseX - (camera.position.x * 2)) * 0.01 ;
//     //camera.position.z = Math.abs( cos)

// 	camera.lookAt( bass.position );
    
//     //
//     //bass.rotation.z =  ( mouseX - (camera.position.x  * 14))
//     //bass.rotation.x = (Math.PI * 0.5 - mouseY / 5)

if(sizes.height > sizes.width)
{
    bass.rotation.y = Math.PI * - 0.5
    bass.rotation.x = 0
    //bass.position.y = 1
    camera.lookAt( new THREE.Vector3(-0, 4, 4));

}
else
{
    bass.rotation.y = 0
    bass.rotation.x = Math.PI * 0.5
}
   

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
}, 30);
</script>
<div id="loading" class="loading-bar"></div>
<div id="num" class="loading-number">{Math.floor(progressRatio * 100)}</div>
