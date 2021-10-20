<script>
  import '../global.css'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import dat from 'dat.gui'
import { OrthographicCamera } from 'three';


  let progressRatio

setTimeout(() => {

  // Debug
const debugObject = {}
// const gui = new dat.GUI({
//     width: 400
// })

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
            }, 30)
            

        
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
//const gltfLoader = new GLTFLoader(loadingManager)



  /**
   * Base
   */
  // Canvas
  const canvas = document.querySelector('canvas.webgl')
  
  // Scene
  const scene = new THREE.Scene()

  const gridHelper = new THREE.GridHelper()
  scene.add(gridHelper)

  const axesHelper = new THREE.AxesHelper()
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
  const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 100)
  //const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, 0.1, 20)
  camera.position.x = 0
  camera.position.y = 2
  camera.position.z = 3
  scene.add(camera)
  
  //AmbientLight

  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

//Loader

const textureLoader = new THREE.TextureLoader(loadingManager)


//ground

const groundGroup = new THREE.Group()
scene.add(groundGroup)

function groundPlane() {
  const geo = new THREE.PlaneGeometry(10, 10)
  const imageSrc = textureLoader.load('assets/images/textures/stratMap/groundTexture.png')
  const mat = new THREE.MeshStandardMaterial(
  { 
      map: imageSrc
  }
  )
  const mesh = new THREE.Mesh(geo, mat)
  groundGroup.add(mesh)
  imageSrc.encoding = THREE.sRGBEncoding
  imageSrc.generateMipmaps = false
  imageSrc.minFilter = THREE.LinearFilter
  imageSrc.magFilter = THREE.LinearFilter

  mesh.rotation.x = - Math.PI / 2
  mesh.position.y = -0.01
  } 
groundPlane()

function road() {

  const geo = new THREE.PlaneGeometry(5, 5)
  const imageSrc = textureLoader.load('assets/images/textures/stratMap/roadTexture.png')
  const alpha = textureLoader.load('assets/images/textures/stratMap/roadAlpha.png')
  const mat = new THREE.MeshStandardMaterial(
  { 
      map: imageSrc,
      alphaMap: alpha,
      transparent: true
  }
  )

  const mesh = new THREE.Mesh(geo, mat)
  groundGroup.add(mesh)
  imageSrc.encoding = THREE.sRGBEncoding
  imageSrc.generateMipmaps = false
  imageSrc.minFilter = THREE.LinearFilter
  imageSrc.magFilter = THREE.LinearFilter

  mesh.position.set(0, 0.1, - 2)
  mesh.rotation.x = - Math.PI / 2
  

  }
road()

//sky

const skyGroup = new THREE.Group()
scene.add(skyGroup)

function skyPlane() {
  const geo = new THREE.PlaneGeometry(10, 2)
  const imageSrc = textureLoader.load('assets/images/textures/stratMap/skyTexture.png')
  const mat = new THREE.MeshStandardMaterial(
  { 
      map: imageSrc
  }
  )
  const mesh = new THREE.Mesh(geo, mat)
  skyGroup.add(mesh)
  imageSrc.encoding = THREE.sRGBEncoding
  imageSrc.generateMipmaps = false
  imageSrc.minFilter = THREE.LinearFilter
  imageSrc.magFilter = THREE.LinearFilter

  //mesh.rotation.x = - Math.PI / 2
  // mesh.scale.x = 5
  // mesh.scale.y = 5
  mesh.position.set(0, 1, - 5)
  } 
skyPlane()

function hills1() {

  const geo = new THREE.PlaneGeometry(10, 1.25)
  const imageSrc = textureLoader.load('assets/images/textures/stratMap/hills1Texture.png')
  const alpha = textureLoader.load('assets/images/textures/stratMap/hills1Alpha.png')
  const mat = new THREE.MeshStandardMaterial(
  { 
      map: imageSrc,
      alphaMap: alpha,
      transparent: true
  }
  )

  const mesh = new THREE.Mesh(geo, mat)
  groundGroup.add(mesh)
  imageSrc.encoding = THREE.sRGBEncoding
  imageSrc.generateMipmaps = false
  imageSrc.minFilter = THREE.LinearFilter
  imageSrc.magFilter = THREE.LinearFilter

  //mesh.position.set(1.11, 0.01, 0)
  //mesh.rotation.x = - Math.PI / 2
  mesh.position.set(0, 0.6, -4.5)


  }
hills1()

function hills2() {

  const geo = new THREE.PlaneGeometry(10, 1.25)
  const imageSrc = textureLoader.load('assets/images/textures/stratMap/hills2Texture.png')
  const alpha = textureLoader.load('assets/images/textures/stratMap/hills2Alpha.png')
  const mat = new THREE.MeshStandardMaterial(
  { 
      map: imageSrc,
      alphaMap: alpha,
      transparent: true
  }
  )

  const mesh = new THREE.Mesh(geo, mat)
  groundGroup.add(mesh)
  imageSrc.encoding = THREE.sRGBEncoding
  imageSrc.generateMipmaps = false
  imageSrc.minFilter = THREE.LinearFilter
  imageSrc.magFilter = THREE.LinearFilter

  //mesh.position.set(1.11, 0.01, 0)
  //mesh.rotation.x = - Math.PI / 2
  mesh.position.set(0, 0.6, -4.75)


  }
hills2()
// Renderer


  const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      })
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputEncoding = THREE.sRGBEncoding
      document.body.appendChild( renderer.domElement )
      debugObject.clearColor = '#ffffff'
      renderer.setClearColor(debugObject.clearColor)
      // gui
      //   .addColor(debugObject, 'clearColor')
      //   .onChange(() =>
      //   {
      //       renderer.setClearColor(debugObject.clearColor)
      //   })


// Controls
    const controls = new OrbitControls(camera, renderer.domElement )
    controls.enableDamping = true
  

//  * Animate
 
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
    <div id="loading" class="loading-bar">{Math.floor(progressRatio * 100)}</div>

  
  
  <style>

  
* {
      overflow: hidden;
  } 

  
  </style>

