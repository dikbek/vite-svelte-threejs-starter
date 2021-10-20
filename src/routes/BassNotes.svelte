<script>
  import '../global.css'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Float16BufferAttribute, RGB_ETC1_Format } from 'three';


setTimeout(() => {


  /**
   * Base
   */
  // Canvas
  const canvas = document.querySelector('canvas.webgl')
  
  // Scene
  const scene = new THREE.Scene()
  
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
  camera.position.x = -3
  camera.position.y = 5
  camera.position.z = 3
  scene.add(camera)
  
  //Note Geometries

  const oct1  = new THREE.CylinderBufferGeometry(0.075, 0.075, 0.01, 12)
  const oct2  = new THREE.CylinderBufferGeometry(0.06, 0.06, 0.01, 12)
  const oct3  = new THREE.CylinderBufferGeometry(0.045, 0.045, 0.01, 12)
  const oct4  = new THREE.CylinderBufferGeometry(0.03, 0.03, 0.01, 12)
  const oct5  = new THREE.CylinderBufferGeometry(0.015, 0.015, 0.01, 12)


  //Note materials
  
  const aNote = new THREE.MeshBasicMaterial({color: 0xff00000})
  const aSNote = new THREE.MeshBasicMaterial({color: 0xf75a1e})
  const bNote = new THREE.MeshBasicMaterial({color: 0xf7931e})
  const cNote = new THREE.MeshBasicMaterial({color: 0xffff00})
  const cSNote = new THREE.MeshBasicMaterial({color: 0xc2f318})
  const dNote = new THREE.MeshBasicMaterial({color: 0x8cd83f})
  const dSNote = new THREE.MeshBasicMaterial({color: 0x00d2ac})
  const eNote = new THREE.MeshBasicMaterial({color: 0x00b6ff})
  const fNote = new THREE.MeshBasicMaterial({color: 0x9c57ff})
  const fSNote = new THREE.MeshBasicMaterial({color: 0xa733d1})
  const gNote = new THREE.MeshBasicMaterial({color: 0x992778})
  const gSNote = new THREE.MeshBasicMaterial({color: 0xcb0061})

const bString = new THREE.Group()
  scene.add(bString)

  const b1 = new THREE.Mesh(oct1, bNote)
  b1.position.x = 1 * 10
  
  const c1 = new THREE.Mesh(oct1, cNote)
  c1.position.x = 1 / 1.0595 * 10

  const cS1 = new THREE.Mesh(oct1, cSNote)
  cS1.position.x = 1 / 1.1225 * 10
  
  const d1 = new THREE.Mesh(oct1, dNote)
  d1.position.x = 1 / 1.1892 * 10

  const dS1 = new THREE.Mesh(oct1, dSNote)
  dS1.position.x = 1 / 1.2599 * 10
  
  const e1 = new THREE.Mesh(oct1, eNote)
  e1.position.x = 1 / 1.3348 * 10
  
  const f1 = new THREE.Mesh(oct1, fNote)
  f1.position.x = 1 / 1.4142 * 10

  const fS1 = new THREE.Mesh(oct1, fSNote)
  fS1.position.x = 1 / 1.4983 * 10

  const g1 = new THREE.Mesh(oct1, gNote)
  g1.position.x = 1 / 1.5874  * 10

  const gS1 = new THREE.Mesh(oct1, gSNote)
  gS1.position.x = 1 / 1.6818 * 10
  
  const a2 = new THREE.Mesh(oct2, aNote)
  a2.position.x = 1 / 1.7818 * 10

  const aS2 = new THREE.Mesh(oct2, aSNote)
  aS2.position.x = 1 / 1.8897 * 10

  const b2 = new THREE.Mesh(oct2, bNote)
  b2.position.x = 1 / 2 * 10

  const c2 = new THREE.Mesh(oct2, cNote)
  c2.position.x = c1.position.x / 2

  const cS2 = new THREE.Mesh(oct2, cSNote)
  cS2.position.x = cS1.position.x / 2

  const d2 = new THREE.Mesh(oct2, dNote)
  d2.position.x = d1.position.x / 2

  const dS2 = new THREE.Mesh(oct2, dSNote)
  dS2.position.x = dS1.position.x / 2

  const e2 = new THREE.Mesh(oct2, eNote)
  e2.position.x = e1.position.x / 2

  const f2 = new THREE.Mesh(oct2, fNote)
  f2.position.x = f1.position.x / 2

  const fS2 = new THREE.Mesh(oct2, fSNote)
  fS2.position.x = fS1.position.x / 2

  const g2 = new THREE.Mesh(oct2, gNote)
  g2.position.x = g1.position.x / 2

  const gS2 = new THREE.Mesh(oct2, gSNote)
  gS2.position.x = gS1.position.x / 2

  const a3 = new THREE.Mesh(oct3, aNote)
  a3.position.x = a2.position.x / 2

  const aS3 = new THREE.Mesh(oct3, aSNote)
  aS3.position.x = aS2.position.x / 2

  const b3 = new THREE.Mesh(oct3, bNote)
  b3.position.x = b2.position.x / 2

  
  const marker = new THREE.Mesh(oct4, bNote)
  
  bString.add(b1, c1, d1, e1, f1, g1, a2, b2, c2, cS2, d2, dS2, e2, f2, fS2, g2, gS2, a3, aS3, b3)
  bString.add(cS1, dS1, fS1, gS1, aS2, marker)
bString.position.set(0, 0, - 0.5)  

const eString = new THREE.Group()
  scene.add(eString)

  const e1E = e1.clone()
  e1E.position.x = 1 * 10
  
  const f1E = f1.clone()
  f1E.position.x = 1 / 1.0595 * 10

  const fS1E = fS1.clone()
  fS1E.position.x = 1 / 1.1225 * 10
  
  const g1E = g1.clone()
  g1E.position.x = 1 / 1.1892 * 10

  const gS1E = gS1.clone()
  gS1E.position.x = 1 / 1.2599 * 10
  
  const a2E = a2.clone()
  a2E.position.x = 1 / 1.3348 * 10
  
  const aS2E = aS2.clone()
  aS2E.position.x = 1 / 1.4142 * 10

  const b2E = b2.clone()
  b2E.position.x = 1 / 1.4983 * 10

  const c2E = c2.clone()
  c2E.position.x = 1 / 1.5874  * 10

  const cS2E = cS2.clone()
  cS2E.position.x = 1 / 1.6818 * 10
  
  const d2E = d2.clone()
  d2E.position.x = 1 / 1.7818 * 10

  const dS2E = dS2.clone()
  dS2E.position.x = 1 / 1.8897 * 10

  const e2E = e2.clone()
  e2E.position.x = 1 / 2 * 10

  const f2E = f2.clone()
  f2E.position.x = c1.position.x / 2

  const fS2E = fS2.clone()
  fS2E.position.x = cS1.position.x / 2

  const g2E = g2.clone()
  g2E.position.x = d1.position.x / 2

  const gS2E = g2.clone()
  gS2E.position.x = dS1.position.x / 2

  const a3E = a3.clone()
  a3E.position.x = e1.position.x / 2

  const aS3E = aS3.clone()
  aS3E.position.x = f1.position.x / 2

  const b3E = b3.clone()
  b3E.position.x = fS1.position.x / 2

  const c3 = new THREE.Mesh(oct3, cNote)
  c3.position.x = c2E.position.x / 2

  const cS3 = new THREE.Mesh(oct3, cSNote)
  cS3.position.x = cS2E.position.x / 2

  const d3 = new THREE.Mesh(oct3, dNote)
  d3.position.x = d2E.position.x / 2

  const dS3 = new THREE.Mesh(oct3, dSNote)
  dS3.position.x = dS2E.position.x / 2

  const e3 = new THREE.Mesh(oct3, eNote)
  e3.position.x = e2E.position.x / 2


    
  eString.add(e1E, f1E, g1E, a2E, b2E, c2E, d2E)
  eString.add(fS1E, gS1E, aS2E, cS2E, dS2E)
  eString.add(e2E, f2E, g2E, a3E, b3E, c3, d3, e3)
  eString.add(fS2E, gS2E, aS3E, cS3, dS3)

eString.position.set(0, 0, - 0.3)

const aString = new THREE.Group()
  scene.add(aString)

  const a2A = a2.clone()
  a2A.position.x = 1 * 10
  
  const aS2A = aS2.clone()
  aS2A.position.x = 1 / 1.0595 * 10

  const b2A = b2.clone()
  b2A.position.x = 1 / 1.1225 * 10
  
  const c2A = c2.clone()
  c2A.position.x = 1 / 1.1892 * 10
  
  const cS2A = cS2.clone()
  cS2A.position.x = 1 / 1.2599 * 10

  const d2A = d2.clone()
  d2A.position.x = 1 / 1.3348 * 10
  
  
  const dS2A = dS2.clone()
  dS2A.position.x = 1 / 1.4142 * 10
  
  const e2A = e2.clone()
  e2A.position.x = 1 / 1.4983 * 10

  const f2A = f2.clone()
  f2A.position.x = 1 / 1.5874  * 10

  const fS2A = fS2.clone()
  fS2A.position.x = 1 / 1.6818 * 10

  const g2A = g2.clone()
  g2A.position.x = 1 / 1.7818 * 10
  
  const gS2A = g2.clone()
  gS2A.position.x = 1 / 1.8897 * 10
 
  const a3A = a3.clone()
  a3A.position.x = 1 / 1 / 2 * 10

  const aS3A = aS3.clone()
  aS3A.position.x = aS2A.position.x / 2


  const b3A = b3.clone()
  b3A.position.x = b2A.position.x / 2

  const c3A = new THREE.Mesh(oct3, cNote)
  c3A.position.x = c2A.position.x / 2

  const cS3A = new THREE.Mesh(oct3, cSNote)
  cS3A.position.x = cS2A.position.x / 2

  const d3A = new THREE.Mesh(oct3, dNote)
  d3A.position.x = d2A.position.x / 2

  const dS3A = new THREE.Mesh(oct3, dSNote)
  dS3A.position.x = dS2A.position.x / 2

  const e3A = new THREE.Mesh(oct3, eNote)
  e3A.position.x = e2A.position.x / 2

  const f3A = new THREE.Mesh(oct3, fNote)
  f3A.position.x = f2A.position.x / 2

  const fS3A = new THREE.Mesh(oct3, fSNote)
  fS3A.position.x = fS2A.position.x / 2

  const g3A = new THREE.Mesh(oct3, gNote)
  g3A.position.x = g2A.position.x / 2

  const gS3A = new THREE.Mesh(oct3, gSNote)
  gS3A.position.x = gS2A.position.x / 2

  const a4 = new THREE.Mesh(oct4,aNote )
  a4.position.x = a3A.position.x / 2

    
  aString.add(a2A, b2A, c2A, d2A, e2A, f2A, g2A)
  aString.add(aS2A, cS2A, dS2A, fS2A, gS2A)

  aString.add(a3A, b3A, c3A, d3A, e3A, f3A, g3A)
  aString.add(aS3A, cS3A, dS3A, fS3A, gS3A, a4)


aString.position.set(0, 0, - 0.1)

const dString = new THREE.Group()
  scene.add(dString)

  const d2D = d2.clone()
  d2D.position.x = 1 * 10
  
  const dS2D = dS2.clone()
  dS2D.position.x = 1 / 1.0595 * 10

  const e2D = e2.clone()
  e2D.position.x = 1 / 1.1225 * 10
  
  const f2D = f2.clone()
  f2D.position.x = 1 / 1.1892 * 10
  
  const fS2D = fS2.clone()
  fS2D.position.x = 1 / 1.2599 * 10

  const g2D = g2.clone()
  g2D.position.x = 1 / 1.3348 * 10
  
  
  const gS2D = gS2.clone()
  gS2D.position.x = 1 / 1.4142 * 10
  
  const a3D = a3.clone()
  a3D.position.x = 1 / 1.4983 * 10

  const aS3D = aS3.clone()
  aS3D.position.x = 1 / 1.5874  * 10

  const b3D = b3.clone()
  b3D.position.x = 1 / 1.6818 * 10

  const c3D = c3.clone()
  c3D.position.x = 1 / 1.7818 * 10
  
  const cS3D = cS3.clone()
  cS3D.position.x = 1 / 1.8897 * 10
 
  const d3D = d3.clone()
  d3D.position.x = 1 / 1 / 2 * 10

  const dS3D = dS3.clone()
  dS3D.position.x = dS2D.position.x / 2


  const e3D = e3A.clone()
  e3D.position.x = e2D.position.x / 2

  const f3D = f3A.clone()
  f3D.position.x = f2D.position.x / 2

  const fS3D = fS3A.clone()
  fS3D.position.x = fS2D.position.x / 2

  const g3D = g3A.clone()
  g3D.position.x = g2D.position.x / 2

  const gS3D = gS3A.clone()
  gS3D.position.x = gS2D.position.x / 2

  const a4D = a4.clone()
  a4D.position.x = a3D.position.x / 2

  const aS4D = new THREE.Mesh(oct4, aSNote)
  aS4D.position.x = aS3D.position.x / 2

  const b4D = new THREE.Mesh(oct4, bNote)
  b4D.position.x = b3D.position.x / 2

  const c4D = new THREE.Mesh(oct4, cNote)
  c4D.position.x = c3D.position.x / 2

  const cS4D= new THREE.Mesh(oct4, cSNote)
  cS4D.position.x = cS3D.position.x / 2

  const d4D = new THREE.Mesh(oct4,dNote )
  d4D.position.x = d3D.position.x / 2

    
  dString.add(d2D, e2D, f2D, g2D, a3D, b3D, c3D)
  dString.add(dS2D, fS2D, gS2D, aS3D, cS3D)
  dString.add(d3D, e3D, f3D, g3D, a4D, b4D, c4D, d4D)
  dString.add(dS3D, fS3D, gS3D, aS4D, cS4D)
 


dString.position.set(0, 0, 0.1)

const gString = new THREE.Group()
  scene.add(gString)

  const g2G = g2.clone()
  g2G.position.x = 1 * 10
  
  const gS2G = gS2.clone()
  gS2G.position.x = 1 / 1.0595 * 10

  const a3G = a3.clone()
  a3G.position.x = 1 / 1.1225 * 10
  
  const aS3G = aS3.clone()
  aS3G.position.x = 1 / 1.1892 * 10
  
  const b3G = b3.clone()
  b3G.position.x = 1 / 1.2599 * 10

  const c3G = c3.clone()
  c3G.position.x = 1 / 1.3348 * 10
  
  const cS3G = cS3.clone()
  cS3G.position.x = 1 / 1.4142 * 10
  
  const d3G = d3.clone()
  d3G.position.x = 1 / 1.4983 * 10

  const dS3G = dS3.clone()
  dS3G.position.x = 1 / 1.5874  * 10

  const e3G = e3.clone()
  e3G.position.x = 1 / 1.6818 * 10

  const f3G = f3A.clone()
  f3G.position.x = 1 / 1.7818 * 10
  
  const fS3G = fS3A.clone()
  fS3G.position.x = 1 / 1.8897 * 10
 
  const g3G = g3A.clone()
  g3G.position.x = 1 / 1 / 2 * 10

  const gS3G = gS3A.clone()
  gS3G.position.x = gS2G.position.x / 2


  const a4G = a4.clone()
  a4G.position.x = a3G.position.x / 2

  const aS4G = aS4D.clone()
  aS4G.position.x = aS3G.position.x / 2

  const b4G = b4D.clone()
  b4G.position.x = b3G.position.x / 2

  const c4G = c4D.clone()
  c4G.position.x = c3G.position.x / 2

  const cS4G = cS4D.clone()
  cS4G.position.x = cS3G.position.x / 2

  const d4G = d4D.clone()
  d4G.position.x = d3G.position.x / 2

  const dS4G = new THREE.Mesh(oct4, dSNote)
  dS4G.position.x = dS3G.position.x / 2

  const e4G = new THREE.Mesh(oct4, eNote)
  e4G.position.x = e3G.position.x / 2

  const f4G = new THREE.Mesh(oct4, fNote)
  f4G.position.x = f3G.position.x / 2

  const fS4G= new THREE.Mesh(oct4, fSNote)
  fS4G.position.x = fS3G.position.x / 2

  const g4G = new THREE.Mesh(oct4,gNote )
  g4G.position.x = g3G.position.x / 2

    
  gString.add(g2G, a3G, b3G, c3G, d3G, e3G, f3G)
  gString.add(gS2G, aS3G, cS3G, dS3G,fS3G)
  gString.add(g3G, a4G, b4G, c4G, d4G, e4G, f4G, g4G)
  gString.add(gS3G, aS4G, cS4G, dS4G,fS4G)
 


gString.position.set(0, 0, 0.3)

const cString = new THREE.Group()
  scene.add(cString)

  const c3C = c3.clone()
  c3C.position.x = 1 * 10
  
  const cS3C = cS3.clone()
  cS3C.position.x = 1 / 1.0595 * 10

  const d3C = d3.clone()
  d3C.position.x = 1 / 1.1225 * 10
  
  const dS3C = dS3.clone()
  dS3C.position.x = 1 / 1.1892 * 10
  
  const e3C = e3.clone()
  e3C.position.x = 1 / 1.2599 * 10

  const f3C = f3A.clone()
  f3C.position.x = 1 / 1.3348 * 10
  
  const fS3C = fS3A.clone()
  fS3C.position.x = 1 / 1.4142 * 10
  
  const g3C = g3A.clone()
  g3C.position.x = 1 / 1.4983 * 10

  const gS3C = gS3A.clone()
  gS3C.position.x = 1 / 1.5874  * 10

  const a4C = a4.clone()
  a4C.position.x = 1 / 1.6818 * 10

  const aS4C = aS4D.clone()
  aS4C.position.x = 1 / 1.7818 * 10
  
  const b4C = b4D.clone()
  b4C.position.x = 1 / 1.8897 * 10
 
  const c4C = c4D.clone()
  c4C.position.x = 1 / 1 / 2 * 10

  const cS4C = cS4D.clone()
  cS4C.position.x = cS3C.position.x / 2

  const d4C = d4D.clone()
  d4C.position.x = d3C.position.x / 2

  const dS4C = dS4G.clone()
  dS4C.position.x = dS3C.position.x / 2

  const e4C = e4G.clone()
  e4C.position.x = e3C.position.x / 2

  const f4C = f4G.clone()
  f4C.position.x = f3C.position.x / 2

  const fS4C = fS4G.clone()
  fS4C.position.x = fS3C.position.x / 2

  const g4C = g4G.clone()
  g4C.position.x = g3C.position.x / 2

  const gS4C = new THREE.Mesh(oct4, gSNote)
  gS4C.position.x = gS3C.position.x / 2

  const a5C = new THREE.Mesh(oct5, aNote)
  a5C.position.x = a4C.position.x / 2

  const aS5C = new THREE.Mesh(oct5, aSNote)
  aS5C.position.x = aS4C.position.x / 2

  const b5C = new THREE.Mesh(oct5, bNote)
  b5C.position.x = b4C.position.x / 2

  const c5C = new THREE.Mesh(oct5,cNote )
  c5C.position.x = c4C.position.x / 2

    
  cString.add(c3C, d3C, e3C, f3C, g3C, a4C, b4C)
  cString.add(cS3C, dS3C, fS3C, gS3C, aS4C)
  cString.add(c4C, d4C, e4C, f4C, g4C, a5C, b5C, c5C)
  cString.add(cS4C, dS4C, fS4C, gS4C, aS5C)
 


cString.position.set(0, 0, 0.5)

const stringsSet = new THREE.Group()
scene.add(stringsSet)

stringsSet.add(bString, eString, aString, dString, gString, cString)


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
  
  
  <style>

  
* {
      overflow: hidden;
  } 

  
  </style>

