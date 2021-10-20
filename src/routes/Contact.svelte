<script>
    import '../global.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { AdditiveBlending, DoubleSide, Vector3 } from 'three'
import * as dat from 'dat.gui'
import { PointLight } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

setTimeout(() => {
    


// Canvas
const canvas = document.querySelector('canvas.webgl')


//Textures
const textureLoader = new THREE.TextureLoader()
const groundContour = textureLoader.load('assets/images/textures/island2.jpg')
const contactAlpha = textureLoader.load('assets/images/textures/makeContact.jpg')
const contactTexture = textureLoader.load('assets/images/textures/makeContact.jpg')

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

//touch

// function touchEventHandler(e) {
//     var touchObj = e.changedTouches[0];
//     mouseX = ( touchObj.clientX - windowHalfX ) / windowHalfX;
//     mouseY = ( touchObj.clientY - windowHalfY ) / windowHalfY;
//     e.preventDefault()
// }

// document.addEventListener('touchstart', touchEventHandler);
// document.addEventListener('touchmove', touchEventHandler);
// document.addEventListener('touchend', touchEventHandler);

// Scene
const scene = new THREE.Scene()

// Fog

const fog = new THREE.Fog('#000000', 5, 25)
scene.fog = fog

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('assets/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

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
ufo.position.y = 3
ufo.scale.set(0.1, 0.1, 0.1)
ufo.add(new THREE.Mesh(new THREE.SphereGeometry(6, 16, 8), new THREE.MeshBasicMaterial({color: 0xffffff})))


//beam

const beamGeo = new THREE.CylinderGeometry(4, 15, 70, 16)
const beamMat = new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    blending: AdditiveBlending,
    transparent: true,
    opacity: 0.6
})
const beam = new THREE.Mesh(beamGeo, beamMat)
beam.position.set(0, - 35, 0)

ufo.add(beam)



const shrooms = new THREE.Group()
scene.add(shrooms)
gltfLoader.load(
    '/assets/models/shrooms.gltf',
    (gltf) =>
    {
        shrooms.add(gltf.scene)
    }
)
console.log(shrooms)
shrooms.position.y = -0.6
shrooms.position.z = 0

shrooms.scale.set(0.3, 0.3, 0.3)
shrooms.castShadow = true
shrooms.receiveShadow = true
/**
 * Floor
 */
const water = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
        color: '#010101',
        metalness: 0,
        roughness: 1
    })
)
water.receiveShadow = true
water.rotation.x = - Math.PI * 0.5
water.position.y = - 0.85
//scene.add(water)

//Island

const island = new THREE.Group()
scene.add(island)
island.rotation.y = Math.PI * 0.25
island.position.set(0, 0, 8)
const islandGeo = new THREE.PlaneGeometry(75, 75, 400, 400)
const islandMatWire = new THREE.MeshPhongMaterial(
    {color: new THREE.Color(0x334455),
    shininess: 1,
    wireframe: true
    }
    )

const islandMatSolid = new THREE.MeshPhongMaterial(
        {color: new THREE.Color(0x010203),
        shininess: 1,
        side: DoubleSide}
        )

const islandWire = new THREE.Mesh(islandGeo, islandMatWire)

    islandMatWire.displacementMap = groundContour
    islandMatWire.displacementScale = 1
    //groundMaterial.normalMap = groundNormal
    //groundMaterial.roughness = 0.51
    islandWire.rotation.x = - Math.PI * 0.5
    islandWire.rotation.z = - Math.PI * 0.3
    islandWire.position.y = - 1
    islandWire.position.z = - 9

    
    
island.add(islandWire)

const islandSolid = new THREE.Mesh(islandGeo, islandMatSolid)

    islandMatSolid.displacementMap = groundContour
    islandMatSolid.displacementScale = 1
    islandSolid.rotation.x = - Math.PI * 0.5
    islandSolid.rotation.z = - Math.PI * 0.3
    islandSolid.position.y = - 1.01
    islandSolid.position.z = - 9

    
    
island.add(islandSolid)
island.castShadow = true
island.receiveShadow = true

// //Text PLane

// const contactGeo = new THREE.PlaneGeometry(2, 1)
// const contactMat = new THREE.MeshStandardMaterial(
//     {   map: contactTexture,
//         //color: 0xffffff,
//         transparent: true,
//         alphaMap: contactAlpha

// })
// const contact = new THREE.Mesh(contactGeo, contactMat)
// contact.position.set(0, 1, 2)
// contact.scale.set(0.5, 0.5, 0.5)
// scene.add(contact)




/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
//scene.add(directionalLight)




const ufoLight = new THREE.SpotLight( 0x887744, 10, 10, (Math.PI), 0.5, 1)
ufoLight.position.y = 2.0
ufoLight.lookAt(new Vector3(beam.position.x, beam.position.y - 2, beam.position.z));    
//ufo.add(ufoLight)

const ufoLightHelper = new THREE.SpotLightHelper(ufoLight, 0xffffff)
//ufo.add(ufoLightHelper)



//STARS BG


// geometry
const starsGeometry = new THREE.BufferGeometry()
const countStars = 5000

const positionsStars = new Float32Array(countStars * 3)
const colorsStars = new Float32Array(countStars * 3)


for(let i = 0; i < countStars * 3; i++)
{   
    const i3 = i * 3

    //Position

    const angle = Math.random() * Math.PI * 2
    const radius = 100 + Math.random() * angle * 50
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    

    // if(i < 20)
    // {
    //     console.log(i, branchAngle)
    // }

    positionsStars[i3  ] = x
    positionsStars[i3 + 1] = Math.random() * 1500 - 750
    //positions[i3 + 1] = (parameters.height / (((Math.cos(branchAngle + spinAngle) * radius + randomX) * (Math.sin(branchAngle + spinAngle) * radius + randomZ)))) 
    positionsStars[i3 + 2] =  z
}

starsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionsStars, 3)
)

starsGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colorsStars, 3)
)

// Material
const starsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('#aaaaaa'),
    size: 1.5,
    sizeAttenuation: false
})

// Particles
const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars);


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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set( 0, 8, 8)
scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 1, 0)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//Composer

const composer = new EffectComposer( renderer );

// const renderPass = new RenderPass( scene, camera );
// composer.addPass( renderPass );

// const bloomPass = new BloomPass();
// composer.addPass( bloomPass );

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

    camera.position.x += ( 4 * mouseX - (camera.position.x)) * 0.05 ;
	camera.position.y += (( - (3 * mouseY) - camera.position.y ) + 4) * 0.05 ;
	camera.lookAt( shrooms.position );
    //ufoLight.lookAt( beam.position )

    ufo.rotation.y += mouseX * 0.25;
    //ufo.rotation.y += mouseY * 0.01;
    // contact.position.x = - (mouseX ) * 0.5
    // contact.position.z = - Math.abs(mouseX * 0.5) + 6.2
    // contact.position.y = - Math.abs(mouseY * 0.1)  + 0.2

    beamMat.opacity = ((1 - Math.abs(mouseX / 10)) / 3) - 0.1
    
    ufo.position.x =  - mouseX * 10
    ufo.position.z = - Math.abs(mouseX)
    ufo.position.y = - Math.abs(mouseY) + 4

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    //controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
}, 30);

</script>
<div class="contact">
    <button> <a href="mailto:info@crudely.co.za">MAKE CONTACT</a></button>
  </div>
<canvas class="webgl"></canvas>



  <style>
.contact 
{   
    display: grid;
    width: 100%;
    height:10%;
    grid-template-columns: 1fr max-content 1fr;
    border: none;
    left: 0vh;
    color: #ffffff;
    text-decoration: none;
    bottom: 10px;
    z-index: 1;
}
button {
    grid-row: 2/3;
    grid-column: 2/3;
    background-color: #00000000;
    font-family: 'JetBrains Mono', monospace; 
    color: #ffffff;
    text-decoration: none;
    border: none;
    font-size: 1.1em;
    
}
button :hover 
{
    color:rgb(169, 223, 98)
}
  </style>