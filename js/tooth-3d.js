(() => {
  const host = document.getElementById('toothScene');
  if (!host || !window.THREE) return; // Emoji fallback stays visible if Three.js/CDN is unavailable.

  try {
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
    camera.position.set(0, 0.05, 5.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd6e8e5, 2.0));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x79c9c3, 1.2);
    fillLight.position.set(3, -1, 3);
    scene.add(fillLight);

    const toothShape = new THREE.Shape();
    toothShape.moveTo(-0.62, 0.38);
    toothShape.bezierCurveTo(-0.9, 0.78, -0.64, 1.05, -0.22, 1.02);
    toothShape.bezierCurveTo(-0.05, 1.01, 0.06, 0.94, 0.18, 0.94);
    toothShape.bezierCurveTo(0.55, 1.05, 0.91, 0.77, 0.63, 0.34);
    toothShape.bezierCurveTo(0.49, 0.12, 0.4, -0.2, 0.31, -0.58);
    toothShape.bezierCurveTo(0.24, -0.9, 0.07, -1.02, -0.04, -0.68);
    toothShape.bezierCurveTo(-0.14, -0.38, -0.2, -0.38, -0.3, -0.7);
    toothShape.bezierCurveTo(-0.41, -1.05, -0.56, -0.91, -0.56, -0.55);
    toothShape.bezierCurveTo(-0.56, -0.18, -0.72, 0.12, -0.62, 0.38);

    const geometry = new THREE.ExtrudeGeometry(toothShape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.09,
      bevelThickness: 0.1,
      curveSegments: 18
    });
    geometry.center();
    const tooth = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({
      color: 0xfafcf8,
      roughness: 0.22,
      metalness: 0.02,
      clearcoat: 0.75,
      clearcoatRoughness: 0.18
    }));
    const model = new THREE.Group();
    model.add(tooth);
    model.rotation.x = -0.12;
    scene.add(model);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.28, 0.012, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x57aaa4, transparent: true, opacity: 0.48 })
    );
    ring.rotation.x = 1.15;
    ring.rotation.y = -0.2;
    scene.add(ring);

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
    else window.addEventListener('resize', resize);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(host);
    }
    const render = (time) => {
      if (visible) {
        if (!reducedMotion) {
          model.rotation.y = Math.sin(time * 0.00035) * 0.34;
          model.rotation.z = Math.sin(time * 0.00023) * 0.035;
          ring.rotation.z += 0.0008;
        }
        renderer.render(scene, camera);
      }
      if (!reducedMotion) requestAnimationFrame(render);
    };
    host.querySelector('.tooth-fallback')?.remove();
    requestAnimationFrame(render);
  } catch (error) {
    // Leave the accessible emoji fallback in place if WebGL isn't available.
    console.warn('3D tooth could not be initialized:', error);
  }
})();
