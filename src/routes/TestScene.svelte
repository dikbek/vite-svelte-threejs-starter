<script>
  
import '../global.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { DoubleSide, Group } from 'three'

setTimeout(() => {

/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

//Mouse define 

let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;

}

//touch
document.addEventListener( 'mousemove', onDocumentMouseMove );

function touchEventHandler(e) {
    var touchObj = e.changedTouches[0];
    mouseX = ( touchObj.clientX - windowHalfX ) / 100;
    mouseY = ( touchObj.clientY - windowHalfY ) / 100;
    e.preventDefault()
}

document.addEventListener('touchstart', touchEventHandler);
document.addEventListener('touchmove', touchEventHandler);
document.addEventListener('touchend', touchEventHandler);

// Scene
const scene = new THREE.Scene()

// Fog

const fog = new THREE.Fog('#000000', 0.1, 7)
scene.fog = fog

//Light
//Ambient
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5)
ambientLight.position.y = 1
ambientLight.position.z = -2

scene.add(ambientLight)

//Pointlight

const ghost1 = new THREE.PointLight('#117799', 8, 20)
ghost1.position.y = 0
scene.add(ghost1)

// const ghost2 = new THREE.PointLight('#5511ff', 5, 20)
// ghost2.position.y = 2
// scene.add(ghost2)

//Hemisphere Light



const hemisphereLight = new THREE.HemisphereLight(0x771199, 0x111199, 5)

const parameters = {
    skyColor: 0xffffff,
    groundColor: 0xff0033
}


// gui
//     .addColor(parameters, 'groundColor')
//     .onChange(() =>
//     {
//         hemisphereLight.groundColor.set(parameters.groundColor)
//     })

//     gui
//     .addColor(parameters, 'skyColor')
//     .onChange(() =>
//     {
//         hemisphereLight.color.set(parameters.skyColor)
//     })

scene.add(hemisphereLight)

console.log(hemisphereLight)

//Directional

const moonLight = new THREE.DirectionalLight( 
    0xffffff, 
    0.2
    )
moonLight.position.set(0, 3, -3)
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
//scene.add(moonLight)


const moonLightHelper = new THREE.DirectionalLightHelper( moonLight)
//scene.add(moonLightHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// const particleTexture = textureLoader.load('/textures/particles/4.png')
const groundContour = textureLoader.load('/assets/images/island.png')


//Planet Group

const planetGroup = new THREE.Group()
scene.add(planetGroup)
planetGroup.rotation.z = Math.PI * 0.15

const planetGroup2 = new THREE.Group()
scene.add(planetGroup2)
planetGroup2.rotation.z = Math.PI * 0.2

const planetGroup3 = new THREE.Group()
scene.add(planetGroup3)
planetGroup3.rotation.z = Math.PI * 0.15

//Sphere

const planetGeo = new THREE.SphereGeometry(0.1, 32, 32)
const planetMat = new THREE.MeshStandardMaterial(
    {
        color: new THREE.Color(0x667788),
        roughness: 1
    }
)

const planetMat2 = new THREE.MeshStandardMaterial(
    {
        color: new THREE.Color(0x778855),
        roughness: 5
    }
)

const planetMat3 = new THREE.MeshStandardMaterial(
    {
        color: new THREE.Color(0x997799),
        roughness: 1,
    }
)


const ringsMat = new THREE.MeshStandardMaterial(
    {
        //color: new THREE.Color(0x227799),
        roughness: 1,
      
    }
)

const planet = new THREE.Mesh(planetGeo, planetMat)
planetGroup.add(planet)

const planet2 = new THREE.Mesh(planetGeo, planetMat2)
planetGroup2.scale.set(1.5, 1.5, 1.5)
planetGroup2.add(planet2)

const moonP2 = new THREE.Mesh(planetGeo, planetMat2)
moonP2.scale.set(0.2, 0.2, 0.2)
moonP2.position.x = 0.5
planetGroup2.add(moonP2)

const planet3 = new THREE.Mesh(planetGeo, planetMat3)
planetGroup3.scale.x = 0.5
planetGroup3.scale.y = 0.5
planetGroup3.scale.z = 0.5
planetGroup3.add(planet3)


// Sun

const sunGeo = new THREE.SphereGeometry(0.6, 32, 32)
const sunMat = new THREE.MeshStandardMaterial(
    {
        color: 0x775533,
    }
)
const sun = new THREE.Mesh(sunGeo, sunMat)
const sunOuter = new THREE.Mesh(
    sunGeo, new THREE.MeshBasicMaterial( 
        { 
            color: 0x222222, 
            transparent: true, 
            blending: THREE.AdditiveBlending 
        } 
    ) 
)
sunOuter.scale.set(1.5, 1.5, 1.5)
scene.add(sun, sunOuter)

//torus

const ringGeo1 = new THREE.RingGeometry( 0.2, 0.3, 64 )

const ringGeo = new THREE.TorusGeometry(0.3, 0.005, 64, 64)

const ring = new THREE.Mesh(ringGeo1, new THREE.MeshStandardMaterial(
    {side: DoubleSide}
))
ring.rotation.x = (Math.PI * 0.5)
planetGroup.add(ring)

const ring2 = new THREE.Mesh(ringGeo, ringsMat)
ring2.rotation.x = (Math.PI * 0.5)
ring2.scale.x = 0.85
ring2.scale.y = 0.85
planetGroup.add(ring2)

const ring3 = new THREE.Mesh(ringGeo,ringsMat)
ring3.rotation.x = (Math.PI * 0.5)
ring3.scale.x = 0.75
ring3.scale.y = 0.75
planetGroup3.add(ring3)




// Plane

const groundGeometry = new THREE.PlaneGeometry(40, 40, 200, 200)
const groundMaterial = new THREE.MeshStandardMaterial(
    {color: new THREE.Color(0x117799)}
    )

const ground = new THREE.Mesh(groundGeometry, groundMaterial)

    //groundMaterial.displacementMap = groundContour
    groundMaterial.displacementScale = 1.5
    //groundMaterial.roughness = 0.51
    groundMaterial.wireframe = true
    ground.rotation.x = - Math.PI * 0.5
    ground.position.y = - 1
    
//scene.add(ground)

const underGroundGeometry = new THREE.PlaneGeometry(10, 10, 100, 100)
const underGroundMaterial = new THREE.MeshStandardMaterial(
    {color: new THREE.Color(0x000000)}
    )
const underGround = new THREE.Mesh(underGroundGeometry, underGroundMaterial)
    underGround.rotation.x = - Math.PI * 0.5
    underGround.position.y =  - 1.01
scene.add(underGround)

//Shadows

//planetGroup.castShadow = true
//moonLight.castShadow = true
//cube.castShadow = true
//ground.receiveShadow = true

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15
/**
 * Particles
 */
// geometry
const starsGeometry = new THREE.BufferGeometry()
const count = 300

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)


for(let i = 0; i < count * 3; i++)
{   


    positions[i] = ((Math.random() - 0.5) * 10)
    colors[i] = Math.random()
}

starsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

starsGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)




// Material

const starsTexture = textureLoader.load('assets/images/1.png')
const starsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('#ffffff'),
    size: 0.1,
    sizeAttenuation: true
})
starsMaterial.transparent = true
starsMaterial.alphaMap = starsTexture
starsMaterial.alphaTest = 0.001
//starsMaterial.depthTest = false
starsMaterial.depthWrite = false
starsMaterial.blending = THREE.AdditiveBlending
//starsMaterial.vertexColors = true

// Particles
const particles = new THREE.Points(starsGeometry, starsMaterial)
scene.add(particles)

//cube
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshStandardMaterial(
        {
            color: 0x001100},
            
        )
)
cube.position.y = - 1
//scene.add(cube)


// From graves - maths to scatter them in a donut fashion


    // const angle = Math.random() * Math.PI * 2
    // const radius = 4 + Math.random() * 6
    // const x = Math.sin(angle) * radius
    // const z = Math.cos(angle) * radius
     //grave.position.set(x, 0.3, z)



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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3.5
camera.position.y = 0.5
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.minDistance = 4
// controls.maxDistance = 4
// console.log(OrbitControls)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//renderer.shadowMap.enabled = true
//renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    camera.position.x += ( mouseX - (camera.position.x * 2)) * 0.01 ;
	camera.position.y += (( - mouseY - (camera.position.y - 2.5) ) * 0.1);

	camera.lookAt( scene.position );
    
    const planetAngle = elapsedTime * 0.05
    const planetAngle2 = elapsedTime * 0.1
    const moonAngle = elapsedTime * 1
    const planetAngle3 = elapsedTime * 1.1

    planetGroup.position.x = Math.cos(planetAngle) * 3.5
    planetGroup.position.z = Math.sin(planetAngle) * 3.5

    moonP2.position.x = (Math.cos(moonAngle) * 0.2) 
    moonP2.position.z = (Math.sin(moonAngle) * 0.2)

    planetGroup2.position.x = (Math.cos(planetAngle2) * 2.5) 
    planetGroup2.position.z = (Math.sin(planetAngle2) * 2.5)

    planetGroup3.position.x = (Math.cos(planetAngle3) * 1) 
    planetGroup3.position.z = (Math.sin(planetAngle3) * 1)

    const starsAngle = - (elapsedTime * 0.01)
    particles.rotation.y = starsAngle
    ground.rotation.z = starsAngle
    underGround.rotation.z = starsAngle

    
    //update particles
    //particles.rotation.y = elapsedTime * 0.2
    // for(let i = 0; i < count; i++)
    // {
    //     const i3 = i * 3
    //     //const x = particlesGeometry.attributes.position.array[i3 + 0]
    //     //particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime)
        
    // }
    //ground.displacementScale.needsUpdate = true
    // particlesGeometry.attributes.position.needsUpdate = true
    // console.log(particlesGeometry.attributes.position.array)

    // Update controls
    //controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()}, 30)
</script>

<div class="window">
<canvas class="webgl"></canvas>
</div>

<style>
    /* * {
          overflow: hidden;
      }  */
    </style>

  