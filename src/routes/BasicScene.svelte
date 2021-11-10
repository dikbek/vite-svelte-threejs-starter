<script>
  import "../global.css";
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import gsap from "gsap";
  import {
    circOut,
    linear,
    sineInOut,
    sineOut,
    quadInOut,
    quadOut,
    quartOut,
    quintOut,
  } from "svelte/easing";
  import * as DomEvents from "threex-domevents";
  var THREEx = {};
  DomEvents(THREE, THREEx);
  console.log(DomEvents, OrbitControls)

  setTimeout(() => {
    /**
     * Base
     */
    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    // Scene
    const scene = new THREE.Scene();

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

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

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 3;
    scene.add(camera);

    //Ico
    const ico = new THREE.Mesh(
      new THREE.IcosahedronBufferGeometry(1, 1),
      new THREE.MeshNormalMaterial({ wireframe: true })
    );
    scene.add(ico);

    ico.scale.set(1.1, 0.9, 1.1);
    ico.position.set(0, -3, 0);

    var yPos = gsap.timeline({ repeat: -1, repeatDelay: 0, yoyo: true });
    yPos.to(ico.position, { y: 5, duration: 1, ease: circOut });

    var yScale = gsap.timeline({
      repeat: -1,
      delay: 0,
      repeatDelay: 0,
      yoyo: true,
    });
    yScale.to(ico.scale, { y: 1.5, duration: 0.5, ease: sineInOut });

    var xzScale = gsap.timeline({ repeat: -1, repeatDelay: 0, yoyo: true });
    xzScale.to(ico.scale, { x: 0.7, z: 0.7, duration: 0.5, ease: sineInOut });

    //  var xzScale = gsap.timeline({repeat: -1, repeatDelay: 0, yoyo:true});
    // xzScale.to(ico.scale, {x: 0.7, z: 0.7, duration: 0.5, ease: sineInOut});

    var yRot = gsap.timeline({ repeat: -1, repeatDelay: 0 });
    yRot.to(ico.rotation, { y: 2, duration: 2, ease: linear });

    //Plane

    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 1,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.set(0, -3.5, 0);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const light = new THREE.PointLight(0xff1177, 2, 20, 5);
    scene.add(light);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    //Dom events

    var domEvents = new THREEx.DomEvents(camera, renderer.domElement);

    domEvents.addEventListener(
      ico,
      "click",
      function (event) {
        console.log("you clicked on the mesh");
      },
      false
    )
    
    domEvents.addEventListener(
      ico,
      "mouseover",
      function (event) {
        console.log("you rolled over the mesh")
        canvas.classList.add('rollover')
      },
      false
    )

    domEvents.addEventListener(
      ico,
      "mouseout",
      function (event) {
        console.log("you rolled off the mesh")
        canvas.classList.remove('rollover')
      },
      false
    )

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let lastElapsedTime = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - lastElapsedTime;
      lastElapsedTime = elapsedTime;

      light.position.y = ico.position.y;

      //Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, 30);
</script>

<canvas class="webgl" />

<style>
  * {
    overflow: hidden;
  }
</style>

