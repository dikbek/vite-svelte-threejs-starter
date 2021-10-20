<script>
    import '../global.css'
    import * as THREE from 'three'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
    import gsap from 'gsap'
import { sineInOut, circInOut, cubicInOut, linear, quadInOut, quadOut, quartOut, quartInOut, quintInOut } from 'svelte/easing';

let progressRatio
  
  setTimeout(() => {



 

  
//canvas, overlay, scene, renderer
    // Canvas
    const canvas = document.querySelector('canvas.webgl')
    
    // Scene
    const scene = new THREE.Scene()

    const gridHelper = new THREE.GridHelper()
    //scene.add(gridHelper)
    
    const axesHelper = new THREE.AxesHelper()
    //scene.add(axesHelper)


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

        gsap.delayedCall(1, () =>
    {
        gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
        setTimeout(() => {
            scene.remove(overlay)
        }, 3000)
    
    })


    /**
     * Renderer
     */
     const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    })
    
  
    
//Sizes
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

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    document.body.appendChild( renderer.domElement )
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
 
//Camera

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
    camera.position.x = 0
    camera.position.y = -0.5
    camera.position.z = 5
    scene.add(camera)
    
  
    
//Lights

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    dirLight.position.set(3, 3, 3)
    //scene.add(dirLight)

//Swings

    const swingsGroup = new THREE.Group()
    scene.add(swingsGroup)

    //Poles

    const aFrame = new THREE.Group()
    swingsGroup.add(aFrame)

    const poleGeo = new THREE.CylinderGeometry(0.075, 0.075, 3, 18, 3)
    const poleMat = new THREE.MeshStandardMaterial( {
        color: 0x83676A,
        roughness: 1,
        flatShading: true
    })
    const pole = new THREE.Mesh(poleGeo, poleMat)
    pole.castShadow = true
    pole.receiveShadow = true
    const latPole = pole.clone()
    
    pole.rotation.x = Math.PI / 9
    pole.position.z = - 0.5

    latPole.scale.y = 1.35
    latPole.rotation.z = Math.PI / 2
    latPole.position.y = 1.4


    const pole2 = pole.clone()
    pole2.rotation.x = - pole.rotation.x
    pole2.position.z = - pole.position.z

    aFrame.add(pole, pole2)
    aFrame.position.x = -2

    const aFrame2 = aFrame.clone()
    aFrame2.position.x = - aFrame.position.x


    swingsGroup.add (aFrame2, latPole)

//Swing Seats

//Swing rotator Group

    const swingRotator = new THREE.Group()
    swingsGroup.add(swingRotator)
    swingRotator.position.y = 1.4

    //Group with seats and rope
    
    const swingSeatGroup = new THREE.Group()
   

    //Group with rope and ropeTie

    const ropeGroup = new THREE.Group()
    
//Rope

    const ropeMat = new THREE.MeshStandardMaterial(
        {
            color: 0x444455,
            roughness: 0.5,
            flatShading: true
        }
    )
    const ropeTieGeo = new THREE.TorusGeometry(0.075, 0.025, 24, 12)
    const ropeTie = new THREE.Mesh(ropeTieGeo, ropeMat)
    ropeTie.position.set(0, 1.4, 0)
    ropeTie.rotation.y = Math.PI / 2
    
    const ropeGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.4, 12, 1)

    const rope = new THREE.Mesh(ropeGeo, ropeMat)
    //rope.castShadow = true
    rope.position.set(0, 0.2, 0)

    ropeGroup.add(ropeTie, rope)
    ropeGroup.position.set(- 0.35, 0, 0)
    const ropeGroup2 = ropeGroup.clone()
    ropeGroup2.position.x = - ropeGroup.position.x

//Seat

    const seatGeo = new THREE.BoxGeometry(0.9, 0.05, 0.3)
    const seatMat = new THREE.MeshStandardMaterial(
        {
            color: 0x992211,
            roughness: 1,
            
        }
    )
    const seat = new THREE.Mesh(seatGeo, seatMat)
    seat.castShadow = true
    seat.position.set(0, -1, 0)
     
//Eyes
        
    const eyes = new THREE.Group()

    const eyeBallGeo = new THREE.SphereGeometry(0.05, 18, 18)
    const eyeBallMat = new THREE.MeshBasicMaterial( { color: 0xffff99})
    const eyeBall = new THREE.Mesh(eyeBallGeo, eyeBallMat)
    eyeBall.position.x = - 0.075

    const eyeLight = new THREE.PointLight(0xffffff, 1, 3, 1)
    eyeLight.position.x = - 0.075
    eyeLight.castShadow = true

    const eyeBall2 = eyeBall.clone()
    eyeBall2.position.x = - eyeBall.position.x


    eyes.add(eyeBall, eyeBall2, eyeLight) 
    
    
    const eyes2 = eyes.clone()


    swingSeatGroup.add(ropeGroup, ropeGroup2, seat)
    swingSeatGroup.position.set( -1, 0 , 0 )

//clone swing seat

    const swingSeatGroup2 = swingSeatGroup.clone()
    eyes2.position.set(0, -0.35, - 0.075)
    swingSeatGroup2.add(eyes2)

    swingSeatGroup2.position.x = - swingSeatGroup.position.x
    swingsGroup.add(swingSeatGroup2)
    eyes.position.set(0, -0.5,- 0.5)
    swingSeatGroup.add(eyes)
    


    const swingRotator2 = new THREE.Group()
    swingsGroup.add(swingRotator2)
    swingRotator2.position.y = 1.4


//Add seat group to rotator, then move y pos
    
    swingRotator.add(swingSeatGroup)
    swingSeatGroup.position.y = - 1.4
    swingRotator.rotation.x =  Math.PI/3

    swingRotator2.add(swingSeatGroup2)
    swingSeatGroup2.position.y = - 1.4
    swingRotator2.rotation.x =  Math.PI/20

//Animate swings and eyes
    
    var tl = gsap.timeline({repeat: -1, repeatDelay: 0, yoyo:true});
    tl.to(swingRotator.rotation, {x: - Math.PI/3, duration: 1, ease:quadInOut});

    var tl2 = gsap.timeline({repeat: -1, repeatDelay: 0, yoyo:true});
    tl2.to(eyes.position, {z: 0.5, duration: 1, ease:cubicInOut});
    
    var tl3 = gsap.timeline({repeat: -1, repeatDelay: 0, yoyo:true});
    tl3.to(eyes.position, {y: - 0.25, duration: 0.5, ease:quadInOut});

    var t4 = gsap.timeline({repeat: -1, repeatDelay: 0, yoyo:true});
    t4.to(swingRotator2.rotation, {x: - Math.PI/20, duration: 1.6, ease:sineInOut});

    var tl5 = gsap.timeline({repeat: -1, repeatDelay: 0, yoyo:true});
    tl5.to(eyes2.position, {z: 0.075, duration: 1.6, ease:sineInOut});


//Position swings last

    //swingsGroup.position.set(-3, 0, -3)

//Cone swing
        const coneSwingGeo = new THREE.ConeGeometry(2.4, 4, 6, 1, true)
        const coneSwingMat = new THREE.MeshStandardMaterial( 
            {
                //wireframe:true,
                wireframeLinewidth: 5,
                color: 0x333333,
                roughness: 0.3,
                metalness: 0.7
            }
        )
        const coneSwingFrame = new THREE.Mesh(coneSwingGeo, coneSwingMat)
        //scene.add(coneSwingFrame)

//Floor

    const floorGeo = new THREE.SphereGeometry(6)
    const floorMat = new THREE.MeshStandardMaterial( {
        color: 0x339988,
        roughness: 1
    })

    const floor = new THREE.Mesh(floorGeo, floorMat)
    //floor.rotation.x = - Math.PI / 2
    floor.scale.y = 0.2
    floor.position.y = - 2.5
    floor.receiveShadow = true
    scene.add(floor)

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
            positionsStars[i3 + 1] = Math.random() * 1000 - 500
            positionsStars[i3 + 2] =  z
        }

        starsGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positionsStars, 3)
        )

    // Material

        //const starTexture = textureLoader.load('assets/images/1.png')
        const starsMaterial = new THREE.PointsMaterial({
            color: new THREE.Color('#aaaa88'),
            size: 2,
            sizeAttenuation: false
        })
        starsMaterial.transparent = true
        //starsMaterial.alphaMap = starTexture
        starsMaterial.alphaTest = 0.001
        //starsMaterial.depthTest = false
        starsMaterial.depthWrite = false
        starsMaterial.blending = THREE.AdditiveBlending
        //starsMaterial.vertexColors = true

        // Particles
        const stars = new THREE.Points(starsGeometry, starsMaterial)
        scene.add(stars);

        //stars.rotation.z = Math.PI / 2

// Controls
    const controls = new OrbitControls(camera, renderer.domElement )
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.minDistance = 4
    controls.maxDistance = 6
    //controls.enableZoom = false
    controls.minPolarAngle = Math.PI / 6
    controls.maxPolarAngle =  Math.PI / 1.75
    // controls.minAzimuthAngle = - Math.PI / 2.5
    // controls.maxAzimuthAngle = Math.PI / 2.5
    
//Animate

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

</style>