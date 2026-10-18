(() => {
  const stage = document.getElementById('clinicTourStage');
  const section = document.getElementById('clinic-tour');
  const progressBar = document.getElementById('tourProgress');
  const copy = document.getElementById('tourCopy');
  const title = document.getElementById('tourTitle');
  const description = document.getElementById('tourDescription');
  const stepLabel = document.getElementById('tourStepLabel');
  if (!stage || !section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let updateFrame = 0;
  let renderFrame = 0;
  let renderScene = () => {};
  let progress = reducedMotion.matches ? 0.68 : 0;
  let roomCopyShown = null;

  // Small, lightweight Three.js room built from simple forms (no model downloads).
  if (window.THREE) {
    try {
      const THREE = window.THREE;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xeaf3f0);
      scene.fog = new THREE.Fog(0xeaf3f0, 18, 34);

      const camera = new THREE.PerspectiveCamera(53, 1, 0.1, 45);
      const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
      renderer.setClearColor(0xeaf3f0, 1);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      stage.prepend(renderer.domElement);

      const materials = {
        wall: new THREE.MeshStandardMaterial({ color: 0xf7faf8, roughness: 0.9 }),
        floor: new THREE.MeshStandardMaterial({ color: 0xdceae6, roughness: 0.82 }),
        trim: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72 }),
        teal: new THREE.MeshStandardMaterial({ color: 0x6fa9a2, roughness: 0.58 }),
        darkTeal: new THREE.MeshStandardMaterial({ color: 0x397b76, roughness: 0.62 }),
        metal: new THREE.MeshStandardMaterial({ color: 0xaebfbd, metalness: 0.45, roughness: 0.34 }),
        wood: new THREE.MeshStandardMaterial({ color: 0xc9a982, roughness: 0.75 }),
        glass: new THREE.MeshStandardMaterial({ color: 0xc8e6e4, emissive: 0x648f8b, emissiveIntensity: 0.16, roughness: 0.25 })
      };

      scene.add(new THREE.HemisphereLight(0xffffff, 0xc5d6d1, 2.2));
      const daylight = new THREE.DirectionalLight(0xfff7e9, 2.4);
      daylight.position.set(-4, 8, 5);
      scene.add(daylight);
      const softFill = new THREE.PointLight(0xc8eeea, 16, 18);
      softFill.position.set(1.5, 3.6, -2.3);
      scene.add(softFill);

      const box = (w, h, d, material, position, rotation = [0, 0, 0]) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
        mesh.position.set(...position);
        mesh.rotation.set(...rotation);
        scene.add(mesh);
        return mesh;
      };
      const cylinder = (rTop, rBottom, height, material, position, segments = 20) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, height, segments), material);
        mesh.position.set(...position);
        scene.add(mesh);
        return mesh;
      };

      // Bright, uncluttered treatment room with a clear open doorway.
      box(10.5, 0.18, 16, materials.floor, [0, -0.1, -1]);
      box(10.5, 0.16, 16, materials.wall, [0, 5.05, -1]);
      box(0.16, 5.1, 16, materials.wall, [-5.25, 2.45, -1]);
      box(0.16, 5.1, 16, materials.wall, [5.25, 2.45, -1]);
      box(10.5, 5.1, 0.18, materials.wall, [0, 2.45, -8.85]);

      // Doorway frame and softly open doors at the entrance.
      box(0.22, 4.5, 0.28, materials.trim, [-3.05, 2.2, 6.55]);
      box(0.22, 4.5, 0.28, materials.trim, [3.05, 2.2, 6.55]);
      box(6.3, 0.22, 0.28, materials.trim, [0, 4.45, 6.55]);
      box(1.15, 3.7, 0.12, materials.wood, [-2.72, 1.86, 6.2], [0, -0.78, 0]);
      box(1.15, 3.7, 0.12, materials.wood, [2.72, 1.86, 6.2], [0, 0.78, 0]);
      cylinder(0.035, 0.035, 0.34, materials.metal, [-2.46, 1.9, 5.88], 12);
      cylinder(0.035, 0.035, 0.34, materials.metal, [2.46, 1.9, 5.88], 12);

      // Rear window and frames bring in a little daylight.
      box(3.4, 1.6, 0.08, materials.glass, [0, 3.52, -8.72]);
      box(0.08, 1.8, 0.12, materials.trim, [-1.78, 3.52, -8.68]);
      box(0.08, 1.8, 0.12, materials.trim, [1.78, 3.52, -8.68]);
      box(3.55, 0.08, 0.12, materials.trim, [0, 2.6, -8.68]);
      box(3.55, 0.08, 0.12, materials.trim, [0, 4.44, -8.68]);
      box(0.07, 1.65, 0.13, materials.trim, [0, 3.52, -8.62]);

      // Dental chair: base, hydraulic lift, reclined back, headrest and arms.
      cylinder(0.1, 0.72, 0.16, materials.metal, [0, 0.12, -1.1]);
      cylinder(0.32, 0.23, 0.74, materials.metal, [0, 0.52, -1.1]);
      box(1.35, 0.23, 1.65, materials.teal, [0, 1.02, -1.18]);
      box(1.17, 1.52, 0.24, materials.teal, [0, 1.83, -2.15], [-0.2, 0, 0]);
      box(0.62, 0.55, 0.2, materials.darkTeal, [0, 2.78, -2.42], [-0.16, 0, 0]);
      box(0.72, 0.17, 0.85, materials.teal, [0, 0.89, -0.04], [-0.08, 0, 0]);
      box(0.14, 0.16, 1.35, materials.metal, [-0.82, 1.36, -1.12]);
      box(0.14, 0.16, 1.35, materials.metal, [0.82, 1.36, -1.12]);
      box(0.1, 0.75, 0.12, materials.metal, [-0.82, 1.02, -0.62]);
      box(0.1, 0.75, 0.12, materials.metal, [0.82, 1.02, -0.62]);

      // Compact cabinetry on the left, with subtle drawer fronts.
      box(1.45, 1.55, 0.75, materials.trim, [-3.85, 0.83, -3.1]);
      box(1.5, 0.12, 0.82, materials.wood, [-3.85, 1.65, -3.1]);
      for (let i = 0; i < 3; i++) {
        box(1.18, 0.025, 0.025, materials.metal, [-3.85, 1.25 + i * 0.37, -2.7]);
      }
      box(1.35, 0.08, 0.74, materials.darkTeal, [-3.85, 1.78, -3.1]);

      // Over-chair exam light and articulated arm.
      cylinder(0.08, 0.08, 0.9, materials.metal, [1.25, 3.65, -2.1], 16);
      box(0.08, 0.08, 1.0, materials.metal, [0.78, 4.08, -2.1], [0, 0, -0.18]);
      cylinder(0.12, 0.12, 0.22, materials.trim, [0.3, 3.83, -2.05], 20);
      const examLamp = new THREE.Mesh(
        new THREE.CircleGeometry(0.48, 32),
        new THREE.MeshBasicMaterial({ color: 0xfff5d9, side: THREE.DoubleSide })
      );
      examLamp.position.set(0.3, 3.68, -2.05);
      examLamp.rotation.x = -Math.PI / 2;
      scene.add(examLamp);

      // Small plant at the back adds a welcoming touch without clutter.
      cylinder(0.28, 0.34, 0.48, materials.wood, [3.85, 0.24, -5.6], 18);
      cylinder(0.045, 0.07, 1.0, materials.darkTeal, [3.85, 0.92, -5.6], 12);
      for (let i = 0; i < 5; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), materials.teal);
        const angle = (i / 5) * Math.PI * 2;
        leaf.position.set(3.85 + Math.cos(angle) * 0.28, 1.32 + (i % 2) * 0.16, -5.6 + Math.sin(angle) * 0.28);
        leaf.scale.set(0.7, 1.4, 0.55);
        scene.add(leaf);
      }

      const resize = () => {
        const width = Math.max(stage.clientWidth, 1);
        const height = Math.max(stage.clientHeight, 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        renderScene();
      };
      if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
      else window.addEventListener('resize', resize);

      renderScene = () => {
        const p = progress;
        camera.position.set(0, THREE.MathUtils.lerp(2.8, 2.35, p), THREE.MathUtils.lerp(13.2, 4.2, p));
        camera.lookAt(0, 1.65, THREE.MathUtils.lerp(-0.8, -2.1, p));
        renderer.render(scene, camera);
      };
      resize();
      stage.classList.add('has-3d');
    } catch (error) {
      console.warn('3D clinic tour unavailable; showing the static tour illustration.', error);
    }
  }

  const updateProgress = () => {
    updateFrame = 0;
    if (!reducedMotion.matches) {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      progress = clamp(-rect.top / distance, 0, 1);
    }
    const inRoom = progress >= 0.52;
    if (copy && roomCopyShown !== inRoom) {
      roomCopyShown = inRoom;
      copy.classList.toggle('is-arrived', inRoom);
      if (title) title.innerHTML = inRoom ? 'Your care,<br />at your pace.' : 'A calm space<br />for confident care.';
      if (description) description.textContent = inRoom
        ? 'A thoughtfully arranged treatment room for gentle, personalized dental care.'
        : 'Scroll to step into our treatment room.';
      if (stepLabel) stepLabel.textContent = inRoom ? 'TREATMENT ROOM' : 'ENTRANCE';
    }
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    renderFrame = requestAnimationFrame(() => renderScene());
  };
  const requestProgressUpdate = () => {
    if (!updateFrame) updateFrame = requestAnimationFrame(updateProgress);
  };

  if (reducedMotion.matches) section.classList.add('reduced-motion');
  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate);
  reducedMotion.addEventListener?.('change', () => {
    section.classList.toggle('reduced-motion', reducedMotion.matches);
    progress = reducedMotion.matches ? 0.68 : 0;
    requestProgressUpdate();
  });
  updateProgress();
})();
