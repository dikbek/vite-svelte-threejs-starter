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
            setTimeout(() => {
            scene.remove(overlay), 3000})
            
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

    // Texture loader
const textureLoader = new THREE.TextureLoader()
    
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
    scene.background = new THREE.Color(0x001020)
    
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
    // const environmentMap = cubeTextureLoader.load([
    //     '/assets/images/environmentMaps/northcliffHill/px.png',
    //     '/assets/images/environmentMaps/northcliffHill/nx.png',
    //     '/assets/images/environmentMaps/northcliffHill/py.png',
    //     '/assets/images/environmentMaps/northcliffHill/ny.png',
    //     '/assets/images/environmentMaps/northcliffHill/pz.png',
    //     '/assets/images/environmentMaps/northcliffHill/nz.png'
    // ])
    
    // environmentMap.encoding = THREE.sRGBEncoding
    
    // scene.background = environmentMap
    // scene.environment = environmentMap
    
    // debugObject.envMapIntensity = 5
    
    //Gltf
    
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/assets/draco/') // draco file copied  from node modules to /static
    
    gltfLoader.setDRACOLoader(dracoLoader)
    
    
    const bassG = new THREE.Group()
    scene.add(bassG)
    
    const acousticBassG = new THREE.Group()
    scene.add(acousticBassG)

    
    /**
     * Models
     */
    gltfLoader.load(
        '/assets/models/bass.gltf',
        (gltf) =>
        {
            
            gltf.scene.scale.set(0.25, 0.25, 0.25)
            gltf.scene.position.set(0, -2.5, 0.5)
            gltf.scene.rotation.z = Math.PI * 0.5
            gltf.scene.rotation.y = Math.PI * 0.5
            bassG.add(gltf.scene)
            updateAllMaterials()
        
        }
       
    )

    gltfLoader.load(
        '/assets/models/acousticBass.glb',
        (gltf) =>
        {
            
            gltf.scene.scale.set(4, 4, 4)
            gltf.scene.position.set(0, -0.5, -0.5)
            gltf.scene.rotation.z = Math.PI * 0.5
            gltf.scene.rotation.y = - Math.PI * 0.5
            acousticBassG.add(gltf.scene)
            updateAllMaterials()
        
        }
       
    )
    
const textGroup = new THREE.Group()
scene.add(textGroup)

function acousticText() {

    const geo = new THREE.PlaneGeometry(2, 1)
    const imageSrc = textureLoader.load('assets/images/textures/acoustic.png')
    const alpha = textureLoader.load('assets/images/textures/acoustic.png')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    textGroup.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter
    mesh.scale.set(3, 3, 3)
    mesh.position.set(0, 0, 0.1)
    mesh.rotation.y = Math.PI

    }
acousticText()

function electricText() {

    const geo = new THREE.PlaneGeometry(2, 1)
    const imageSrc = textureLoader.load('assets/images/textures/electric.png')
    const alpha = textureLoader.load('assets/images/textures/electric.png')
    const mat = new THREE.MeshStandardMaterial(
    { 
        map: imageSrc,
        alphaMap: alpha,
        transparent: true
    }
    )

    const mesh = new THREE.Mesh(geo, mat)
    textGroup.add(mesh)
    imageSrc.encoding = THREE.sRGBEncoding
    imageSrc.generateMipmaps = false
    imageSrc.minFilter = THREE.LinearFilter
    imageSrc.magFilter = THREE.LinearFilter

    mesh.position.set(0, 0, -0.01)
    mesh.scale.set(3, 3, 3)
    //mesh.rotation.y = Math.PI


    }
electricText()
    
    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)


    const directionalLight = new THREE.DirectionalLight('#8899ff', 2)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(0.25, 3, 2.25)
    //directionalLight.shadow.autoUpdate = false
    scene.add(directionalLight)

    const directionalLight2 = new THREE.DirectionalLight('#8899ff', 2)
    directionalLight2.castShadow = true
    directionalLight2.shadow.camera.far = 15
    directionalLight2.shadow.mapSize.set(1024, 1024)
    directionalLight2.shadow.normalBias = 0.05
    directionalLight2.position.set(0.25, 3, - 2.25)
    //directionalLight2.shadow.autoUpdate = false
    scene.add(directionalLight2)

    
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
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.set(0, -7, 1)
    scene.add(camera)
    
    
    
    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    })
    // renderer.physicallyCorrectLights = true;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement )
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 4
    controls.maxDistance = 10
    //controls.enableZoom = false
    controls.dampingFactor = 0.05
    controls.minPolarAngle = Math.PI / 30
    controls.maxPolarAngle =  Math.PI / 1.1
    // controls.minAzimuthAngle = - Math.PI / 3
    // controls.maxAzimuthAngle = Math.PI / 3
    // controls.autoRotate = true
    // controls.autoRotateSpeed = -3   
    
    
    /**
     * Animate
     */
    
    const clock = new THREE.Clock()
    
    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()
        
        // Update controls
        controls.update()
        
        //bassG.rotation.y = elapsedTime * 0.1
    
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
   
    
    