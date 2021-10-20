<script>
    import '../global.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
//import { BackSide, DoubleSide, Side } from 'three'
import gsap from 'gsap'
import { text } from 'svelte/internal';


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
        setTimeout(() => {
                scene.remove(overlay) 
            }, 3000)
            

        
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

const gridHelper = new THREE.GridHelper
//scene.add(gridHelper)

const axesHelper = new THREE.AxesHelper
scene.add(axesHelper)

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


//Light

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
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

//Textures

const bakedTextureFrames = textureLoader.load('/assets/images/textures/exhibitFrames.jpg')
bakedTextureFrames.flipY = false
bakedTextureFrames.encoding = THREE.sRGBEncoding

const bakedTextureWallCenter = textureLoader.load('/assets/images/textures/exhibitWalls.jpg')
bakedTextureWallCenter.flipY = false
bakedTextureWallCenter.encoding = THREE.sRGBEncoding

const bakedTextureCeilingFloor = textureLoader.load('/assets/images/textures/exhibitCeilingFloor.jpg')
bakedTextureCeilingFloor.flipY = false
bakedTextureCeilingFloor.encoding = THREE.sRGBEncoding


// // artwork textures



// Attempt to create a function for image loading

/**

function ImageLoad (
    meshName: THREE.Mesh,    
    textureImage: string,
    alphaImage: string,
    width: number,
    height: number,
    positionX: number,
    positionY: number,
    positionZ: number,
    rotationY: number
    ) 

    {

        const loader = new THREE.TextureLoader()
        const imageSrc = loader.load('assets/images/textures/{textureImage}')
        const alpha = loader.load('assets/images/textures/{alphaImage}')
        const mat = new THREE.MeshStandardMaterial(
    {     
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
   }
    )

    const geo = new THREE.PlaneGeometry(width, height)
    meshName = new THREE.Mesh(geo, mat)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    meshName.position.set(positionX, positionY, positionZ)
    meshName.rotation.y = rotationY
    scene.add(meshName)
    return meshName
}

ImageLoad (
    belvedereMesh,
    'belvedere-1024px.jpg', 
    'belvedere-alpha-1024px.jpg', 
    2.2, 
    2.2, 
    -2.18, 
    0.075, 
    3.75, 
    - Math.PI / 6
)

 */


 //churches wall


 const churchesWall = new THREE.Group()
 scene.add(churchesWall)


function belvedereArt() {

    const geo = new THREE.PlaneGeometry(2.2, 2.2)

    const imageSrc = textureLoader.load('assets/images/textures/exhibit/belvedere-1024px.jpg')
    const alpha = textureLoader.load('assets/images/textures/exhibit/belvedere-alpha-1024px.jpg')
    const mat = new THREE.MeshStandardMaterial(
   { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
   }
    )

    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(-2.18, 0.075, 3.75)
    mesh.rotation.y = - Math.PI / 6 

}
belvedereArt()

function church01() {

    const geo = new THREE.PlaneGeometry(0.85, 1.7)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/church01.jpg')
    //const alpha = textureLoader.load('assets/images/textures/belvedere-alpha-1024px.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        //alphaMap: alpha,
        //transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    churchesWall.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(-1.44, 0, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
church01()

function church02() {

    const geo = new THREE.PlaneGeometry(0.85, 1.7)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/church02-800px.jpg')
    //const alpha = textureLoader.load('assets/images/textures/belvedere-alpha-1024px.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        //alphaMap: alpha,
        //transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    churchesWall.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(0, 0, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
church02()

function church03() {

    const geo = new THREE.PlaneGeometry(0.85, 1.7)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/church03.jpg')
    //const alpha = textureLoader.load('assets/images/textures/belvedere-alpha-1024px.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        //alphaMap: alpha,
        //transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    churchesWall.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(1.425, 0, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
church03()

churchesWall.position.set(-4.35, -0.01, 0)
churchesWall.rotation.y = - Math.PI / 2

const roundWall1 = new THREE.Group()
scene.add(roundWall1)

function crackedRoom() {

    const geo = new THREE.PlaneGeometry(1.475, 1.475)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/crackedroom-1024px.jpg')
    const alpha = textureLoader.load('assets/images/textures/exhibit/round-alpha-512px.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    roundWall1.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(-1.105, 0.015, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
crackedRoom()

function consumed() {

    const geo = new THREE.PlaneGeometry(1.475, 1.475)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/consumed-1024px.jpg')
    const alpha = textureLoader.load('assets/images/textures/exhibit/round-alpha-512px.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    roundWall1.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(1.11, 0.01, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
consumed()


roundWall1.position.set(4.36, -0.01, 0)
roundWall1.rotation.y = Math.PI / 2

const tubeWall = new THREE.Group()
scene.add(tubeWall)

function tube1() {

    const geo = new THREE.PlaneGeometry(1.025, 1.025)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/tubeCar.jpg')
    const alpha = textureLoader.load('assets/images/textures/exhibit/tubeAlpha.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    tubeWall.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(-1.3725, 0, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
tube1()

function tube2() {

    const geo = new THREE.PlaneGeometry(1.025, 1.025)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/tubeDog.jpg')
    const alpha = textureLoader.load('assets/images/textures/exhibit/tubeAlpha.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    tubeWall.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(0, 0, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
tube2()

function tube3() {

    const geo = new THREE.PlaneGeometry(1.025, 1.025)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/tubeLamp.jpg')
    const alpha = textureLoader.load('assets/images/textures/exhibit/tubeAlpha.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    tubeWall.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(1.3725, 0, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
tube3()

tubeWall.rotation.y = Math.PI - Math.PI / 6
tubeWall.position.set(2.157, -0.01, -3.775)

const roundWall2 = new THREE.Group()
scene.add(roundWall2)

function clouds() {

    const geo = new THREE.PlaneGeometry(1.475, 1.475)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/clouds.jpg')
    const alpha = textureLoader.load('assets/images/textures/exhibit/round-alpha-512px.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    roundWall2.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(-1.105, 0.015, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
clouds()

function coffeeBreak() {

    const geo = new THREE.PlaneGeometry(1.475, 1.475)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/coffeebreak.jpg')
    const alpha = textureLoader.load('assets/images/textures/exhibit/round-alpha-512px.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    roundWall2.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(1.11, 0.01, 0)
    // mesh.rotation.y = - Math.PI / 6 

}
coffeeBreak()


roundWall2.rotation.y = - (Math.PI - Math.PI / 6)
roundWall2.position.set(- 2.185, -0.01, -3.775)

const fireFly = new THREE.Group()
scene.add(fireFly)

function FireFly() {

    const geo = new THREE.PlaneGeometry(2.5, 1.25)
    const imageSrc = textureLoader.load('assets/images/textures/exhibit/firefly.jpg')
    //const alpha = textureLoader.load('assets/images/textures/exhibit/round-alpha-512px.jpg')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        // alphaMap: alpha,
        // transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    fireFly.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

  

}
FireFly()

fireFly.rotation.y = (Math.PI / 6)
fireFly.position.set( 2.185, 0.1, 3.775)


//Materials

// Baked materials

const bakedMaterialFrames = new THREE.MeshBasicMaterial({ map: bakedTextureFrames })
const bakedMaterialWallCenter = new THREE.MeshBasicMaterial({ map: bakedTextureWallCenter })
const bakedMaterialCeilingFloor = new THREE.MeshBasicMaterial({ map: bakedTextureCeilingFloor })

//artworks







//PoleLight material
const poleLightMaterial = new THREE.MeshBasicMaterial({color: 0xffffe5 })



//Models

//Frames

gltfLoader.load(
    '/assets/models/exhibitFrames.glb',
    (gltf) =>
    {   
        console.log(gltf.scene)



        console.log(gltf)
        //Apply materials
           gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterialFrames
        })

      

        scene.add(gltf.scene)
      

    }
)

//center wall

gltfLoader.load(
    '/assets/models/exhibitWalls.glb',
    (gltf) =>
    {   
        console.log(gltf.scene)

        //Apply materials
           gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterialWallCenter
        })


      

        scene.add(gltf.scene)
   

    })

//ceiling / floor
    gltfLoader.load(
    '/assets/models/exhibitCeilingFloor.glb',
    (gltf) =>
    {   
        console.log(gltf.scene)

        //Apply materials
           gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterialCeilingFloor
        })


      

        scene.add(gltf.scene)
   

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
camera.position.x = 4.55
camera.position.y = - 0.25
camera.position.z = 8.5
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






// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.enablePan = false
controls.minDistance = 7
controls.maxDistance = 13
//controls.enableZoom = false
controls.dampingFactor = 0.1
controls.minPolarAngle = Math.PI / 2.175
controls.maxPolarAngle =  Math.PI / 1.875
// controls.minAzimuthAngle = - Math.PI 
// controls.maxAzimuthAngle = Math.PI 

//debugObject.clearColor = '#0c0a0f'
renderer.setClearColor('#0a0f0d')
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

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