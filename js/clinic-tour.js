(() => {
  const stage = document.getElementById('clinicTourStage');
  const section = document.getElementById('clinic-tour');
  const progressBar = document.getElementById('tourProgress');
  const copy = document.getElementById('tourCopy');
  const title = document.getElementById('tourTitle');
  const description = document.getElementById('tourDescription');
  const action = document.getElementById('tourAction');
  const caption = document.getElementById('tourCaption');
  const stepLabel = document.getElementById('tourStepLabel');
  if (!stage || !section) return;

  const stops = [
    { at: 0, label: 'WELCOME', caption: 'Reception & welcome', title: 'Welcome to<br />your clinic.', description: 'Scroll through the suite to explore care, braces, smile cases and the treatment room.', action: 'Explore the clinic', href: '#services' },
    { at: 0.16, label: 'EVERYDAY CARE', caption: 'Preventive & family care', title: 'Care for the<br />whole family.', description: 'Cleaning, children’s dentistry, restorations and more—all in one place.', action: 'See dental services', href: '#services' },
    { at: 0.33, label: 'ORTHODONTICS', caption: 'Braces & aligners', title: 'A straighter smile,<br />your way.', description: 'Explore braces and clear aligners for children, teens and adults.', action: 'Explore orthodontics', href: '#orthodontics' },
    { at: 0.49, label: 'SMILE CORRECTIONS', caption: 'Smile correction gallery', title: 'Every smile has<br />its own story.', description: 'See examples of common bite and alignment concerns in the gallery.', action: 'View corrections', href: '#corrections' },
    { at: 0.66, label: 'CASE GALLERY', caption: 'Clinical case shelves · 6–10', title: 'A closer look<br />at clinical cases.', description: 'Mandible cases 6–10 are displayed along the gallery wall.', action: 'View cases 6–10', href: '#mandible-gallery' },
    { at: 0.84, label: 'IMPLANT CARE', caption: 'Implant & restorative care', title: 'Thoughtful care,<br />planned for you.', description: 'Explore implant and restorative options with an in-person assessment.', action: 'Explore implant care', href: '#implant-showcase' },
    { at: 0.96, label: 'YOUR VISIT', caption: 'Treatment room & appointments', title: 'Ready when<br />you are.', description: 'Request a visit and talk with the clinic about your next steps.', action: 'Book an appointment', href: '#contact' }
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let updateFrame = 0;
  let progress = reducedMotion.matches ? 0.97 : 0;
  let currentStop = -1;
  let renderScene = () => {};

  if (window.THREE) {
    try {
      const THREE = window.THREE;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xe4efeb);
      scene.fog = new THREE.Fog(0xe4efeb, 34, 58);

      const camera = new THREE.PerspectiveCamera(53, 1, 0.1, 80);
      const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
      renderer.setClearColor(0xe4efeb, 1);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      stage.prepend(renderer.domElement);

      const materials = {
        wall: new THREE.MeshLambertMaterial({ color: 0xe5eeea }),
        floor: new THREE.MeshLambertMaterial({ color: 0xbacdc6 }),
        trim: new THREE.MeshLambertMaterial({ color: 0xfafbf8 }),
        teal: new THREE.MeshLambertMaterial({ color: 0x438b84 }),
        darkTeal: new THREE.MeshLambertMaterial({ color: 0x286c66 }),
        metal: new THREE.MeshPhongMaterial({ color: 0x829b98, shininess: 48 }),
        wood: new THREE.MeshLambertMaterial({ color: 0xb98e65 }),
        glass: new THREE.MeshLambertMaterial({ color: 0x8fcac5, emissive: 0x174a46, emissiveIntensity: 0.18 })
      };

      scene.add(new THREE.HemisphereLight(0xffffff, 0x90aaa2, 1.15));
      const daylight = new THREE.DirectionalLight(0xfff7e9, 1.7);
      daylight.position.set(-4, 8, 5);
      scene.add(daylight);
      const softFill = new THREE.PointLight(0xc8eeea, 3.5, 18);
      softFill.position.set(1.5, 3.6, -22.5);
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

      // A long, open dental suite: reception, gallery shelves, then the treatment room.
      box(10.5, 0.18, 40, materials.floor, [0, -0.1, -11]);
      box(10.5, 0.16, 40, materials.wall, [0, 5.05, -11]);
      box(0.16, 5.1, 40, materials.wall, [-5.25, 2.45, -11]);
      box(0.16, 5.1, 40, materials.wall, [5.25, 2.45, -11]);
      box(10.5, 5.1, 0.18, materials.wall, [0, 2.45, -30.85]);

      // Entrance frame and open doors.
      box(0.22, 4.5, 0.28, materials.trim, [-3.05, 2.2, 6.55]);
      box(0.22, 4.5, 0.28, materials.trim, [3.05, 2.2, 6.55]);
      box(6.3, 0.22, 0.28, materials.trim, [0, 4.45, 6.55]);
      box(1.15, 3.7, 0.12, materials.wood, [-2.72, 1.86, 6.2], [0, -0.78, 0]);
      box(1.15, 3.7, 0.12, materials.wood, [2.72, 1.86, 6.2], [0, 0.78, 0]);
      cylinder(0.035, 0.035, 0.34, materials.metal, [-2.46, 1.9, 5.88], 12);
      cylinder(0.035, 0.035, 0.34, materials.metal, [2.46, 1.9, 5.88], 12);

      // Daylight window at the far end.
      box(3.4, 1.6, 0.08, materials.glass, [0, 3.52, -30.72]);
      box(0.08, 1.8, 0.12, materials.trim, [-1.78, 3.52, -30.68]);
      box(0.08, 1.8, 0.12, materials.trim, [1.78, 3.52, -30.68]);
      box(3.55, 0.08, 0.12, materials.trim, [0, 2.6, -30.68]);
      box(3.55, 0.08, 0.12, materials.trim, [0, 4.44, -30.68]);
      box(0.07, 1.65, 0.13, materials.trim, [0, 3.52, -30.62]);

      // Small reception counter near the entrance.
      box(2.3, 1.05, 0.72, materials.trim, [0, 0.55, 3.6]);
      box(2.45, 0.12, 0.82, materials.wood, [0, 1.12, 3.6]);
      box(1.3, 0.08, 0.04, materials.darkTeal, [0, 1.22, 3.16]);

      // Framed case images and label plaques on wall-mounted display shelves.
      const loader = new THREE.TextureLoader();
      const labelTexture = (heading, subheading) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 112;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fdfefd';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#286c66';
        ctx.font = 'bold 30px Arial';
        ctx.fillText(heading.toUpperCase(), 22, 44);
        ctx.fillStyle = '#62777b';
        ctx.font = '22px Arial';
        ctx.fillText(subheading, 22, 82);
        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        return texture;
      };
      const addShelf = ({ side, z, image, title: shelfTitle, subtitle }) => {
        const left = side === 'left';
        const wallX = left ? -5.04 : 5.04;
        const faceX = left ? -4.965 : 4.965;
        const inwardX = left ? -4.77 : 4.77;
        const rotationY = left ? Math.PI / 2 : -Math.PI / 2;
        const frameWidth = 1.48;
        const frameHeight = 1.76;
        const imageWidth = 1.28;
        const imageHeight = 1.42;
        const centerY = 3.05;

        box(frameWidth, frameHeight, 0.12, materials.wood, [wallX, centerY, z], [0, rotationY, 0]);
        const pictureMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, toneMapped: false });
        const picture = new THREE.Mesh(new THREE.PlaneGeometry(imageWidth, imageHeight), pictureMaterial);
        picture.position.set(faceX, centerY + 0.08, z);
        picture.rotation.y = rotationY;
        scene.add(picture);
        loader.load(image, texture => {
          texture.encoding = THREE.sRGBEncoding;
          texture.needsUpdate = true;
          pictureMaterial.map = texture;
          pictureMaterial.needsUpdate = true;
          renderScene();
        }, undefined, () => {
          // The printed label remains useful if a particular image fails to load.
        });

        const plaque = new THREE.Mesh(
          new THREE.PlaneGeometry(frameWidth, 0.28),
          new THREE.MeshBasicMaterial({ map: labelTexture(shelfTitle, subtitle), side: THREE.DoubleSide, toneMapped: false })
        );
        plaque.position.set(faceX, 2.12, z);
        plaque.rotation.y = rotationY;
        scene.add(plaque);

        box(0.52, 0.1, frameWidth + 0.34, materials.wood, [inwardX, 1.91, z]);
        box(0.07, 0.42, 0.07, materials.metal, [inwardX, 1.65, z - 0.63]);
        box(0.07, 0.42, 0.07, materials.metal, [inwardX, 1.65, z + 0.63]);
      };

      // Service and braces displays on the right; mandibular cases 6–10 on the left.
      addShelf({ side: 'left', z: 3.4, image: 'images/after-crossbite.svg', title: 'Family dental care', subtitle: 'PREVENTIVE · RESTORATIVE · KIDS' });
      addShelf({ side: 'right', z: 1.0, image: 'images/bracels.jpeg', title: 'Braces · front', subtitle: 'ORTHODONTIC CARE' });
      addShelf({ side: 'right', z: -2.0, image: 'images/bracels left.jpeg', title: 'Braces · left', subtitle: 'BRACES & ALIGNERS' });
      addShelf({ side: 'right', z: -5.0, image: 'images/bracels right.jpeg', title: 'Braces · right', subtitle: 'CHILDREN · TEENS · ADULTS' });
      addShelf({ side: 'right', z: -7.7, image: 'images/before-crossbite.svg', title: 'Crossbite', subtitle: 'SMILE CORRECTION' });
      addShelf({ side: 'right', z: -10.3, image: 'images/after-crowding.svg', title: 'Crowding', subtitle: 'SMILE CORRECTION' });
      addShelf({ side: 'left', z: -7.2, image: 'images/mandibel 6.jpeg', title: 'Mandible · 06', subtitle: 'CLINICAL CASE' });
      addShelf({ side: 'left', z: -9.6, image: 'images/mandibel 7.jpeg', title: 'Mandible · 07', subtitle: 'CLINICAL CASE' });
      addShelf({ side: 'left', z: -12.0, image: 'images/mandibel 8.jpeg', title: 'Mandible · 08', subtitle: 'CLINICAL CASE' });
      addShelf({ side: 'left', z: -14.4, image: 'images/mandibel 9.jpeg', title: 'Mandible · 09', subtitle: 'CLINICAL CASE' });
      addShelf({ side: 'left', z: -16.8, image: 'images/mandibel 10.jpeg', title: 'Mandible · 10', subtitle: 'CLINICAL CASE' });
      addShelf({ side: 'right', z: -18.8, image: 'images/implant maxilla pterygoid region.jpeg', title: 'Implant care', subtitle: 'INDIVIDUAL ASSESSMENT' });

      // Ceiling lights guide the camera down the suite.
      [-1, -9, -17, -25].forEach(z => {
        box(1.7, 0.08, 0.8, materials.trim, [0, 4.94, z]);
        const ceilingLight = new THREE.PointLight(0xfff5dc, 2.2, 10);
        ceilingLight.position.set(0, 4.35, z);
        scene.add(ceilingLight);
      });

      // Dental chair and exam light at the end of the suite.
      cylinder(0.1, 0.72, 0.16, materials.metal, [0, 0.12, -22.1]);
      cylinder(0.32, 0.23, 0.74, materials.metal, [0, 0.52, -22.1]);
      box(1.35, 0.23, 1.65, materials.teal, [0, 1.02, -22.18]);
      box(1.17, 1.52, 0.24, materials.teal, [0, 1.83, -23.15], [-0.2, 0, 0]);
      box(0.62, 0.55, 0.2, materials.darkTeal, [0, 2.78, -23.42], [-0.16, 0, 0]);
      box(0.72, 0.17, 0.85, materials.teal, [0, 0.89, -21.04], [-0.08, 0, 0]);
      box(0.14, 0.16, 1.35, materials.metal, [-0.82, 1.36, -22.12]);
      box(0.14, 0.16, 1.35, materials.metal, [0.82, 1.36, -22.12]);
      box(0.1, 0.75, 0.12, materials.metal, [-0.82, 1.02, -21.62]);
      box(0.1, 0.75, 0.12, materials.metal, [0.82, 1.02, -21.62]);
      cylinder(0.08, 0.08, 0.9, materials.metal, [1.25, 3.65, -23.1], 16);
      box(0.08, 0.08, 1.0, materials.metal, [0.78, 4.08, -23.1], [0, 0, -0.18]);
      const examLamp = new THREE.Mesh(new THREE.CircleGeometry(0.48, 32), new THREE.MeshBasicMaterial({ color: 0xfff5d9, side: THREE.DoubleSide }));
      examLamp.position.set(0.3, 3.68, -23.05);
      examLamp.rotation.x = -Math.PI / 2;
      scene.add(examLamp);

      // A plant softens the far corner of the treatment room.
      cylinder(0.28, 0.34, 0.48, materials.wood, [3.85, 0.24, -27.7], 18);
      cylinder(0.045, 0.07, 1.0, materials.darkTeal, [3.85, 0.92, -27.7], 12);
      for (let i = 0; i < 5; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), materials.teal);
        const angle = (i / 5) * Math.PI * 2;
        leaf.position.set(3.85 + Math.cos(angle) * 0.28, 1.32 + (i % 2) * 0.16, -27.7 + Math.sin(angle) * 0.28);
        leaf.scale.set(0.7, 1.4, 0.55);
        scene.add(leaf);
      }

      // Scroll keyframes turn the view toward each shelf, then into the treatment room.
      const cameraPath = [
        { at: 0, position: [0, 3.0, 15.2], target: [0, 1.7, 1.0] },
        { at: 0.17, position: [-1.4, 2.8, 8.0], target: [-4.55, 2.55, 3.1] },
        { at: 0.34, position: [1.4, 2.75, 1.5], target: [4.55, 2.6, -1.6] },
        { at: 0.51, position: [1.5, 2.65, -5.3], target: [4.55, 2.6, -8.2] },
        { at: 0.71, position: [-1.4, 2.65, -10.0], target: [-4.55, 2.7, -13.0] },
        { at: 0.87, position: [1.3, 2.6, -15.0], target: [4.55, 2.7, -18.6] },
        { at: 1, position: [0, 2.8, -19.2], target: [0, 1.7, -24.0] }
      ];
      const interpolate = (a, b, t) => a.map((value, index) => THREE.MathUtils.lerp(value, b[index], t));
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
        let index = cameraPath.findIndex((point, i) => i < cameraPath.length - 1 && progress >= point.at && progress <= cameraPath[i + 1].at);
        if (index < 0) index = cameraPath.length - 2;
        const from = cameraPath[index];
        const to = cameraPath[index + 1];
        const mix = clamp((progress - from.at) / Math.max(to.at - from.at, 0.001), 0, 1);
        camera.position.set(...interpolate(from.position, to.position, mix));
        camera.lookAt(...interpolate(from.target, to.target, mix));
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

    let nextStop = 0;
    for (let i = 0; i < stops.length; i++) if (progress >= stops[i].at) nextStop = i;
    if (nextStop !== currentStop) {
      currentStop = nextStop;
      const stop = stops[currentStop];
      if (title) title.innerHTML = stop.title;
      if (description) description.textContent = stop.description;
      if (action) { action.textContent = stop.action; action.href = stop.href; }
      if (caption) caption.textContent = stop.caption;
      if (stepLabel) stepLabel.textContent = stop.label;
      copy?.classList.toggle('is-arrived', currentStop >= 4);
    }
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    requestAnimationFrame(() => renderScene());
  };
  const requestProgressUpdate = () => {
    if (!updateFrame) updateFrame = requestAnimationFrame(updateProgress);
  };

  if (reducedMotion.matches) section.classList.add('reduced-motion');
  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate);
  reducedMotion.addEventListener?.('change', () => {
    section.classList.toggle('reduced-motion', reducedMotion.matches);
    progress = reducedMotion.matches ? 0.97 : 0;
    requestProgressUpdate();
  });
  updateProgress();
})();
