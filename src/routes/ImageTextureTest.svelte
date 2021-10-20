<script>
  import '../global.css'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
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
        scene.remove(overlay)
        loadingBarElement.classList.add('ended')
        loadingBarElement.style.transform = ''
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



  /**
   * Base
   */
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
  camera.position.x = 0
  camera.position.y = 5
  camera.position.z = 15
  scene.add(camera)
  

//Light

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)
  
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
  
//Image texture test

const imageSrc = textureLoader.load('assets/images/textures/crackedroom-1024px.jpg')
const alpha = textureLoader.load('assets/images/textures/round-alpha-512px.jpg')
const mat = new THREE.MeshStandardMaterial(
   { 
     map: imageSrc,
     alphaMap: alpha,
     transparent: true
   }
)

const geo = new THREE.PlaneGeometry(2, 2)
const mesh = new THREE.Mesh(geo, mat)
scene.add(mesh)


//Baked Scenes

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

// Baked materials

const bakedMaterialFrames = new THREE.MeshBasicMaterial({ map: bakedTextureFrames })
const bakedMaterialWallCenter = new THREE.MeshBasicMaterial({ map: bakedTextureWallCenter })
const bakedMaterialCeilingFloor = new THREE.MeshBasicMaterial({ map: bakedTextureCeilingFloor })

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

      

        //scene.add(gltf.scene)
      

    })


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


      

        //scene.add(gltf.scene)
   

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


      

        //scene.add(gltf.scene)
   

    })

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  document.body.appendChild( renderer.domElement )
  renderer.outputEncoding = THREE.sRGBEncoding


    // Controls
    const controls = new OrbitControls(camera, renderer.domElement )
  controls.enableDamping = true
  
  /**
   * Animate
   */
  const clock = new THREE.Clock()
  let lastElapsedTime = 0
  
  const tick = () =>
  {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - lastElapsedTime
      lastElapsedTime = elapsedTime
  
      //Update controls
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
    <div id="loading"class=loading-bar></div>
  
  
  <style>

  
* {
      overflow: hidden;
  } 

  
  </style>

