<script>
  import "../global.css";
  import * as THREE from "three";
  import { AdditiveBlending, TextureLoader } from "three";
  //import * as dat from "dat.gui";
  import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
  import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
  import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
  import { gsap } from "gsap";

  setTimeout(() => {
    // **
    //  * Loaders
    //  */

    const loadingBarElement = document.querySelector(".loading-bar");
    console.log(loadingBarElement);

    const loadingManager = new THREE.LoadingManager(
      //Loaded
      () => {
        gsap.delayedCall(1, () => {
          gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 });
          loadingBarElement.classList.add("ended");
          //loadingBarElement.style.transform = ''
        });
      },

      //Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal;
        //loadingBarElement.style.transform = `scaleX(${progressRatio})`
        console.log(progressRatio);
      }
    );
    console.log(loadingManager);

    /**
     * Base
     */
    // Debug
    //const gui = new dat.GUI();

    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    //Mouse define

    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    function onDocumentMouseMove(event) {
      mouseX = (event.clientX - windowHalfX) / (0.1 * windowHalfX);
      mouseY = (event.clientY - windowHalfY) / windowHalfY;
    }
    document.addEventListener("mousemove", onDocumentMouseMove);

    //touch

    // function touchEventHandler(e) {
    //     var touchObj = e.changedTouches[0];
    //     mouseX = ( touchObj.clientX - windowHalfX ) / 100;
    //     mouseY = ( touchObj.clientY - windowHalfY ) / 100;
    //     e.preventDefault()
    // }

    // document.addEventListener('touchstart', touchEventHandler);
    // document.addEventListener('touchmove', touchEventHandler);
    // document.addEventListener('touchend', touchEventHandler);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let scene, renderer;

    let ringStone, heartM, ringSpinner;

    let dRing, dBar, dRingAnchor, oRing, oRingAnchor, bRing, bBar, bRingAnchor;

    let head, stoneTop, tx, txAnchor;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    // Fog

    const fog = new THREE.Fog("#000000", 50, 1000);
    scene.fog = fog;

    //overlay

    const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
    const overlayMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 1 },
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
    `,
    });
    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    //scene.add(overlay)

    // Renderer

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      50,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(1, 4, 27.6);
    camera.lookAt(0, 20, 0);
    scene.add(camera);

    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 1, 1, 0.9);
    composer.addPass(bloomPass);
    // bloomPass.radius = 1
    // bloomPass.threshold = 0.9

    //Letters

    const letterTorus = new THREE.TorusGeometry(6.3, 2.6, 8, 12);
    const letterCyl = new THREE.CylinderGeometry(2.2, 2, 23, 6);
    const letterMat = new THREE.MeshStandardMaterial({
      color: 0x757677,
      roughness: 0.5,
      flatShading: true,
    });

    //D
    dRing = new THREE.Mesh(letterTorus, letterMat);
    dRingAnchor = new THREE.Group();
    scene.add(dRingAnchor);
    dRingAnchor.add(dRing);
    dRing.position.set(-20.2, 6, -39);

    dBar = new THREE.Mesh(letterCyl, letterMat);

    //B
    bRing = dRing.clone();
    bRingAnchor = new THREE.Group();
    scene.add(bRingAnchor);
    bRingAnchor.add(bRing);
    bRing.position.set(26, 11, -16.9);

    bBar = dBar.clone();

    //Set DBar position after cloning

    dBar.position.set(-10.8, 17.4, -23);
    bBar.position.set(22.5, 19, -26);

    //O
    oRingAnchor = new THREE.Group();
    oRing = new THREE.Mesh(new THREE.TorusGeometry(7, 2.24, 8, 12), letterMat);
    oRing.position.set(16, 11, -48);
    oRingAnchor.add(oRing);

    //Heart mesh

    const heartG = new THREE.TorusGeometry(14, 2.24, 6, 12, Math.PI);
    heartM = new THREE.MeshBasicMaterial({
      color: 0x993366,
      transparent: true,
      blending: AdditiveBlending,
    });
    const heart = new THREE.Mesh(heartG, heartM);
    heart.position.set(7, 0, 0);
    heart.rotation.z = Math.PI;

    //TX
    txAnchor = new THREE.Group();
    tx = new THREE.Object3D();
    const t1 = new THREE.Mesh(letterCyl, letterMat);
    t1.scale.set(0.4, 0.25, 0.4);
    t1.position.set(-4, 1.75, 0);
    const t2 = t1.clone();
    t2.scale.set(0.4, 0.25, 0.4);
    t2.position.set(-4, 4.5, 0);
    t2.rotation.z = Math.PI / 2;
    const x1 = t1.clone();
    x1.scale.set(0.4, 0.33, 0.4);
    x1.position.set(1, 2, 0);
    x1.rotation.z = Math.PI / 5;
    const x2 = x1.clone();
    x1.rotation.z = -Math.PI / 5;

    tx.add(t1, t2, x1, x2);
    tx.position.set(-27, 20, -80);
    scene.add(txAnchor);
    txAnchor.add(tx);

    //MR
    const mr = new THREE.Group();
    const mRing = new THREE.Mesh(
      new THREE.TorusGeometry(7, 2.24, 6, 6, Math.PI),
      letterMat
    );
    const mRing2 = mRing.clone();
    const rRing = new THREE.Mesh(
      new THREE.TorusGeometry(7, 2.24, 6, 6, (Math.PI * 100) / 180),
      letterMat
    );
    mRing2.position.set(13.8, 0, 0);
    rRing.position.set(28.1, 0, 0);
    rRing.rotation.x = -Math.PI;
    rRing.rotation.z = -Math.PI;
    mr.add(mRing, mRing2, rRing);

    mr.position.set(9, 30, -42);
    mr.scale.set(0.5, 0.5, 0.5);
    mr.add(heart);

    scene.add(dRingAnchor, dBar, bRingAnchor, bBar, oRingAnchor, mr);

    // totem

    const totem = new THREE.Group();
    scene.add(totem);

    const totemStone = new THREE.MeshStandardMaterial({
      color: 0x112233,
      flatShading: true,
    });

    const totemShiney = new THREE.MeshPhongMaterial({
      color: 0x441133,
      shininess: 0.8,
    });
    const jointPaper = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });

    const cherryGlow = new THREE.MeshStandardMaterial({
      color: 0xff3300,
    });

    const totemCyl = new THREE.CylinderGeometry(4, 4.6, 1.2, 12, 1);
    const totemIco = new THREE.IcosahedronGeometry(1, 1);
    const totemIcoSmall = new THREE.IcosahedronGeometry(1, 0);
    const totemOcta = new THREE.OctahedronGeometry(1.2, 1);
    const totemHorn = new THREE.CylinderBufferGeometry(0.2, 0.5, 2.28, 6, 1);

    const totemRing = new THREE.TorusGeometry(3.4, 0.75, 8, 12);
    const stand = new THREE.Mesh(totemCyl, totemStone);
    stand.receiveShadow = true;
    const nipple = new THREE.Mesh(totemIco, totemStone);
    nipple.receiveShadow = true;

    nipple.scale.set(2.86, 2.86, 2.86);
    nipple.position.set(0, 2, 0);

    const ring = new THREE.Mesh(totemRing, letterMat);
    ring.position.set(0, 5.845, 0);

    ringSpinner = new THREE.Mesh(totemIcoSmall, totemShiney);
    ringSpinner.scale.set(1.25, 1.25, 1.25);
    ringSpinner.position.set(0, 6.5, 0);

    ringStone = new THREE.Mesh(totemIco, totemStone);
    ringStone.scale.set(2.26, 2.26, 2.26);
    ringStone.position.set(0, 10.741, 0);

    ringStone.castShadow = true;

    const octa = new THREE.Mesh(totemOcta, totemStone);
    octa.position.set(0, 13.615, 0);

    stoneTop = new THREE.Mesh(totemIco, totemStone);
    stoneTop.position.set(0, 16.66, 0);
    stoneTop.scale.set(1.9, 1.9, 1.9);

    head = new THREE.Object3D();
    totem.add(head);
    head.position.set(0, 19.615, 0);

    const headStone = new THREE.Mesh(totemIcoSmall, totemStone);
    headStone.scale.set(1.08, 1.08, 1.08);

    const horn = new THREE.Mesh(totemHorn, totemStone);
    horn.position.set(-1.023, 1.5, 0);
    horn.rotation.z = Math.PI / 6;
    const horn2 = horn.clone();
    horn2.position.set(1.023, 1.5, 0);
    horn2.rotation.z = -Math.PI / 6;

    const joint = new THREE.Mesh(totemHorn, jointPaper);
    joint.rotation.x = -Math.PI / 3;
    joint.position.set(0, -1, 1.69);

    const cherry = new THREE.Mesh(totemIcoSmall, cherryGlow);
    cherry.position.set(0, -1.8, 3);
    cherry.scale.set(0.5, 0.5, 0.5);

    head.add(headStone, horn, horn2, joint, cherry);

    totem.add(stand, nipple, ring, ringSpinner, ringStone, octa, stoneTop);

    // Ground

    const groundM = new THREE.MeshStandardMaterial({
      color: 0x051020,
      roughness: 1,
      flatShading: true,
    });
    const ground = new THREE.Mesh(totemIco, groundM);
    ground.scale.set(20, 3, 20);
    ground.position.set(0, -3, 0);
    ground.receiveShadow = true;
    scene.add(ground);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const hemLight = new THREE.HemisphereLight(0x223388, 0x228855, 1);
    scene.add(hemLight);

    const cherryLight = new THREE.PointLight(0xff3300, 5, 25);
    head.add(cherryLight);
    cherryLight.position.set(0, -1.8, 2);
    cherryLight.castShadow = true;
    console.log(cherryLight.shadow);

    const heartLight = new THREE.PointLight(0x993366, 10, 25, 1);
    mr.add(heartLight);
    heartLight.position.set(0, -2, 0);

    //STARS BG

    // geometry
    const starsGeometry = new THREE.BufferGeometry();
    const countStars = 15000;

    const positionsStars = new Float32Array(countStars * 3);
    const colorsStars = new Float32Array(countStars * 3);

    for (let i = 0; i < countStars * 3; i++) {
      const i3 = i * 3;

      //Position

      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 50;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      // if(i < 20)
      // {
      //     console.log(i, branchAngle)
      // }

      positionsStars[i3] = x;
      positionsStars[i3 + 1] = Math.random() * 1500 - 750;
      //positions[i3 + 1] = (parameters.height / (((Math.cos(branchAngle + spinAngle) * radius + randomX) * (Math.sin(branchAngle + spinAngle) * radius + randomZ))))
      positionsStars[i3 + 2] = z;
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsStars, 3)
    );

    starsGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colorsStars, 3)
    );

    // Material

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const starTexture = textureLoader.load("assets/images/1.png");
    const starsMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#ffffffs"),
      size: 2,
      sizeAttenuation: true,
    });
    starsMaterial.transparent = true;
    starsMaterial.alphaMap = starTexture;
    starsMaterial.alphaTest = 0.001;
    //starsMaterial.depthTest = false
    starsMaterial.depthWrite = false;
    starsMaterial.blending = THREE.AdditiveBlending;

    // Particles
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let previousTime = 0;

    function tick() {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      camera.position.x += (mouseX * 15 - camera.position.x * 2) * 0.05;
      camera.position.y += (-mouseY * 4 - camera.position.y + 4) * 0.05;
      camera.lookAt(ringStone.position);

      heartM.opacity = 1 - mouseX * (Math.random() - 0.4);

      ringSpinner.rotation.y += mouseX * 0.2;
      ringSpinner.rotation.x += mouseY * 0.01;

      dRing.rotation.z += mouseX * 0.05;
      bRing.rotation.z -= mouseX * 0.05;

      dRingAnchor.position.x = -mouseX * 20;
      dRingAnchor.position.y = Math.abs(mouseX) * 10;
      dRingAnchor.position.z = -Math.abs(mouseX) * 5;
      bRingAnchor.position.x = -mouseX * 5;
      bRingAnchor.position.y = Math.abs(mouseX) * 10;
      bRingAnchor.position.z = -Math.abs(mouseX) * 10;

      oRing.rotation.y = mouseX * 5;
      oRing.rotation.z += mouseX * 0.01;
      oRingAnchor.position.z = -Math.abs(mouseX) * 10;

      bBar.rotation.y -= mouseX * 0.05;
      bBar.rotation.x = mouseX;
      dBar.rotation.y -= mouseX * 0.05;
      dBar.rotation.z = mouseX * 2;

      head.position.z = Math.abs(mouseX) * 0.5;
      stoneTop.position.z = Math.abs(mouseX) * 0.25;

      txAnchor.position.z = Math.abs(mouseY) * 20;
      tx.rotation.x = mouseX;
      tx.rotation.y = mouseX * 0.5;

      // Update controls
      //controls.update()

      // Render
      composer.render(scene);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    }
    tick();
  }, 30);
</script>

<canvas class="webgl" />
<div class="loading-bar" />

