
<canvas class="webgl"></canvas>
<script>
    import '../global.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { BackSide, DoubleSide } from 'three'
import gsap from 'gsap'


let progressRatio

setTimeout(() => {
    
/**
 * Loaders
 */


 const loadingBarElement = document.getElementById('loading')
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
        scene.remove(overlay)
        console.log('loaded')
    })
    },

    //Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        progressRatio =  itemsLoaded / itemsTotal 
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
        console.log(progressRatio)
    }
)
const gltfLoader = new GLTFLoader(loadingManager)

// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.spector()
// spector.displayUI()
/**
 * Base
 */
// Debug
//  const debugObject = {}
// const gui = new dat.GUI({
//     width: 400
// })

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
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('assets/draco/')

// GLTF loader
gltfLoader.setDRACOLoader(dracoLoader)

//Mouse define 

let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / windowHalfX;
    mouseY = ( event.clientY - windowHalfY ) / windowHalfY;

}
document.addEventListener( 'mousemove', onDocumentMouseMove );

//Textures

const bakedTexture = textureLoader.load('/assets/images/textures/bakedCity.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

console.log(bakedTexture)
//Materials

// Baked material

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })



//PoleLight material
const poleLightMaterial = new THREE.MeshBasicMaterial({color: 0xffffe5 })



//Model

gltfLoader.load(
    '/assets/models/cityScape.glb',
    (gltf) =>
    {   
        console.log(gltf.scene)
        const bakedMesh = gltf.scene.children.find(child => child.name ==='baked')
        const poleLightMesh = gltf.scene.children.find(child => child.name ==='lamplight')


        console.log(gltf)
        //Apply materials
           gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })

        //bakedMesh.material = bakedMaterial
        poleLightMesh.material = poleLightMaterial
      

        scene.add(gltf.scene)
        gltf.scene.position.y = - 1 
        gltf.scene.position.z = 2
        gltf.scene.rotation.y = - Math.PI / 2

    //     const underWorld = gltf.scene.clone()
    // //scene.add(underWorld)
    // underWorld.rotation.x = Math.PI
    // underWorld.position.y = - 0.01
    // underWorld.scale.z = - 1
    }
)

//UFO

let mixer = null
const ufo = new THREE.Group()
scene.add(ufo)
gltfLoader.load(
    '/assets/models/ufo.gltf',
    (gltf) =>
    {
        ufo.add(gltf.scene)
    }
)
ufo.position.y = 2
ufo.scale.set(0.075, 0.075, 0.075)
ufo.add(new THREE.Mesh(new THREE.SphereGeometry(4, 16, 8), new THREE.MeshBasicMaterial({color: 0xffffff})))


//beam

const beamGeo = new THREE.CylinderGeometry(4, 15, 70, 16)
const beamMat = new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.6
})
const beam =     new THREE.Mesh(beamGeo, beamMat)
beam.position.set(0, - 35, 0)

ufo.add(beam)

const welcomeImage = textureLoader.load('assets/images/welcome.jpg')
welcomeImage.encoding = THREE.sRGBEncoding
welcomeImage.generateMipmaps = false
welcomeImage.minFilter = THREE.LinearFilter
welcomeImage.magFilter = THREE.LinearFilter

const welcomeGeo = new THREE.PlaneGeometry(6, 3)
const welcomeMat = new THREE.MeshBasicMaterial( 
    { 
        color: 0xffffff, 
        map: welcomeImage,
        alphaMap: welcomeImage,
        transparent: true,
        side: DoubleSide,
        opacity: 0.75
        
    }
    )
const welcome = new THREE.Mesh(welcomeGeo, welcomeMat)
scene.add(welcome)
welcome.position.set(0, 1, 4)

//STARS

// geometry
const starsGeometry = new THREE.BufferGeometry()
const countStars = 1000

const positionsStars = new Float32Array(countStars * 3)

for(let i = 0; i < countStars * 3; i++)
{   
    const i3 = i * 3

    //Position

    const angle = Math.random() * Math.PI * 2
    const radius = 20 + Math.random() * 100
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    

    // if(i < 20)
    // {
    //     console.log(i, branchAngle)
    // }

    positionsStars[i3  ] = x
    positionsStars[i3 + 1] = Math.random() * 2000 
    positionsStars[i3 + 2] =  z
}

starsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionsStars, 3)
)


// Material

const starTexture = textureLoader.load('assets/images/1.png')
const starsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('#aaaa88'),
    size: 5,
    sizeAttenuation: true
})
starsMaterial.transparent = true
starsMaterial.alphaMap = starTexture
starsMaterial.alphaTest = 0.001
//starsMaterial.depthTest = false
starsMaterial.depthWrite = false
starsMaterial.blending = THREE.AdditiveBlending
//starsMaterial.vertexColors = true

// Particles
const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars);

//stars.rotation.z = Math.PI / 2

const fontLoader = new FontLoader(loadingManager)
fontLoader.load(
    '/assets/fonts/JetBrainsMono/JetBrainsMonoExtraBold_Regular.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'illustrative.dev',
            {
                font: font,
                size: 0.5,
                height: 0.1,
                curveSegments: 3,
                bevelEnabled: false,
                bevelThickness: 0.05,
                bevelSize: 0.1,
                bevelOffset: - 0.05,
                bevelSegments: 1
            }
        )
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // )
        textGeometry.center()

        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)

        
        const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.75} );
        //textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, beamMat)
        scene.add(text)
        text.position.set(0, -0.5, 5)
        //text.rotation.y = Math.PI 
        })



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

    //Update fireflies

    // firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 20
scene.add(camera)


/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

//Post processor 

const composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );





// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.1
controls.enablePan = false
controls.minDistance = 10
controls.maxDistance = 20
//controls.enableZoom = false
controls.dampingFactor = 0.05
controls.minPolarAngle = Math.PI / 3
controls.maxPolarAngle =  Math.PI / 2.01
controls.autoRotate = true
controls.autoRotateSpeed = 0.1  
// controls.minAzimuthAngle = - Math.PI 
// controls.maxAzimuthAngle = Math.PI 

//debugObject.clearColor = '#0c0a0f'
renderer.setClearColor('#0c0a0f')
// gui
//     .addColor(debugObject, 'clearColor')
//     .onChange(() =>
//     {
//         renderer.setClearColor(debugObject.clearColor)
//     })


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    ufo.rotation.y += mouseX * 0.25;
    welcome.position.z = - Math.abs(mouseX)  + 4

    beamMat.opacity = ((1 - Math.abs(mouseX / 10)) / 3) - 0.1
    
    ufo.position.x =  - mouseX * 10
    ufo.position.z = - Math.abs(mouseX)
    ufo.position.y = - Math.abs(mouseY) + 3

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    //update materials

    // firefliesMaterial.uniforms.uTime.value = elapsedTime
    // portalLightMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

}, 30);
</script>

<canvas class="webgl"></canvas>
<div id="loading" class="loading-bar">{Math.floor(progressRatio * 100)}</div>

<style>
   
   canvas:focus { 
    outline: none; 
}
</style>