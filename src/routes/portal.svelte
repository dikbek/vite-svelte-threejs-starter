<script>
import '../global.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { BackSide } from 'three'
import firefliesVertexShader from '../shaders/fireflies/vertex.vert'
import firefliesFragmentShader from '../shaders/fireflies/fragment.frag'
import portalVertexShader from '../shaders/portal/vertex.vert'
import portalFragmentShader from '../shaders/portal/fragment.frag'


console.log(portalFragmentShader)

setTimeout (() => {

// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.spector()
// spector.displayUI()
/**
 * Base
 */
// Debug
const debugObject = {}
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/assets/draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

//Textures

const bakedTexture = textureLoader.load('assets/images/textures/baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding
//Materials

// Baked material

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })



//PoleLight material
const poleLightMaterial = new THREE.MeshBasicMaterial({color: 0xffffe5 })

//Portal light material

debugObject.portalColorStart = '#340e26'
debugObject.portalColorEnd  = '#ffffff'

gui 
    .addColor(debugObject, 'portalColorStart')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart)
    })

    gui 
    .addColor(debugObject, 'portalColorEnd')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
    })

const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms: 
    { 
        uTime: { value:0 },
        uColorStart: { value: new THREE.Color(0x340e26)},
        uColorEnd: {value: new THREE.Color(0xffffff)}
    },
    vertexShader: `
    varying vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}`,
    fragmentShader: portalFragmentShader
})






//Model

gltfLoader.load(
    'assets/models/portal.glb',
    (gltf) =>
    {   
        const bakedMesh = gltf.scene.children.find(child => child.name ==='baked')
        const poleLightAMesh = gltf.scene.children.find(child => child.name ==='poleLight1')
        const poleLightBMesh = gltf.scene.children.find(child => child.name === 'poleLight2')
        const portalLightMesh = gltf.scene.children.find(child => child.name === 'Circle')

        //Apply materials

        bakedMesh.material = bakedMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
        portalLightMesh.material = portalLightMaterial

        scene.add(gltf.scene)
        gltf.scene.position.y = 0.01 
        const underWorld = gltf.scene.clone()
    //scene.add(underWorld)
    underWorld.rotation.x = Math.PI
    underWorld.position.y = - 0.01
    underWorld.scale.z = - 1
    }
)
// Black divider plane

const veilGeo = new THREE.PlaneGeometry(100, 100)
const veilMat = new THREE.MeshStandardMaterial({color: 0x000000, side: THREE.DoubleSide})
const veil = new THREE.Mesh(veilGeo, veilMat)
//veil.position.y = 1
veil.rotation.x = 0.5 * Math.PI
veilMat.transparent = true
veilMat.opacity = 0.7
//scene.add(veil)

//Fireflies

const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for(let i = 0; i < firefliesCount; i++ )
{
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
    positionArray[i * 3 + 1] = Math.random() * 1.5
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4

    scaleArray[i] = Math.random()
}
firefliesGeometry.setAttribute('position',new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale',new THREE.BufferAttribute(scaleArray, 1))


//Material

const firefliesMaterial = new THREE.ShaderMaterial({ 
    uniforms:
    {
        uTime: { value: 0},
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2)},
        uSize: { value: 100 }
    },
    vertexShader: `uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
}`,
    fragmentShader: `void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - (0.05 * 2.);
    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
})

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')

//Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
document.body.appendChild( renderer.domElement )

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

    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 4
camera.position.z = 1
scene.add(camera)




// Controls
const controls = new OrbitControls(camera, renderer.domElement)
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

debugObject.clearColor = '#1e0313'
renderer.setClearColor(debugObject.clearColor)
gui
    .addColor(debugObject, 'clearColor')
    .onChange(() =>
    {
        renderer.setClearColor(debugObject.clearColor)
    })


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //update materials

    firefliesMaterial.uniforms.uTime.value = elapsedTime
    portalLightMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
}, 30)
</script>

<canvas class="webgl"></canvas>

<style>
    *
{
    margin: 0;
    padding: 0;
}

.webgl
{
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
}
</style>