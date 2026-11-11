import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NODE_COUNT = 60;
const ASSEMBLE_DURATION = 2.5;
const RADIUS = 3.2;
const SCATTER_SPREAD = 12;

function fibonacciSphere(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius),
    );
  }
  return points;
}

function scatterPoint(spread: number) {
  return new THREE.Vector3(
    (Math.random() - 0.5) * spread,
    (Math.random() - 0.5) * spread,
    (Math.random() - 0.5) * spread,
  );
}

function dustField(count: number, inner: number, outer: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const dir = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
    ).normalize();
    const r = inner + Math.random() * (outer - inner);
    positions.set([dir.x * r, dir.y * r, dir.z * r], i * 3);
  }
  return positions;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf6f1e7, 8.5, 16);
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);

    // Lighting: warm key, violet rim, champagne accent - reads as polished chrome on cream.
    scene.add(new THREE.AmbientLight(0xfff6e8, 0.68));
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(4, 6, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x8b5cf6, 26, 24, 2);
    rim.position.set(-5.5, -2, -3.5);
    scene.add(rim);
    const accent = new THREE.PointLight(0xf0b95e, 14, 20, 2);
    accent.position.set(3.5, -4, 2.5);
    scene.add(accent);

    const group = new THREE.Group();
    scene.add(group);

    // Chrome-violet torus knot core, scaled in during the assemble.
    const coreGeo = new THREE.TorusKnotGeometry(1.02, 0.3, 220, 36);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      metalness: 0.85,
      roughness: 0.22,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.scale.setScalar(0.001);
    group.add(core);

    // Structural wire shell counter-rotating around the core.
    const shellGeo = new THREE.IcosahedronGeometry(2.55, 1);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x6d28d9,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    // Nodes: scattered cloud that assembles onto a sphere surface, lit so they catch the key light.
    const endPositions = fibonacciSphere(NODE_COUNT, RADIUS);
    const startPositions = endPositions.map(() => scatterPoint(SCATTER_SPREAD));
    const current = startPositions.map((p) => p.clone());

    const nodeGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x6d28d9, roughness: 0.35, metalness: 0.15 });
    const mesh = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
    const dummy = new THREE.Object3D();
    group.add(mesh);

    // Connection lines between nodes that land near each other.
    const linePositions: number[] = [];
    const threshold = RADIUS * 0.5;
    for (let i = 0; i < endPositions.length; i++) {
      for (let j = i + 1; j < endPositions.length; j++) {
        if (endPositions[i].distanceTo(endPositions[j]) < threshold) {
          linePositions.push(...endPositions[i].toArray(), ...endPositions[j].toArray());
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x6d28d9,
      transparent: true,
      opacity: 0,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // Two dust layers give real depth: near violet motes, far warm sparks fading into fog.
    const dustNearGeo = new THREE.BufferGeometry();
    dustNearGeo.setAttribute('position', new THREE.BufferAttribute(dustField(340, 4.2, 7.5), 3));
    const dustNearMat = new THREE.PointsMaterial({
      color: 0x8b5cf6,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const dustNear = new THREE.Points(dustNearGeo, dustNearMat);
    scene.add(dustNear);

    const dustFarGeo = new THREE.BufferGeometry();
    dustFarGeo.setAttribute('position', new THREE.BufferAttribute(dustField(140, 7.5, 12), 3));
    const dustFarMat = new THREE.PointsMaterial({
      color: 0xd9a648,
      size: 0.07,
      transparent: true,
      opacity: 0.32,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const dustFar = new THREE.Points(dustFarGeo, dustFarMat);
    scene.add(dustFar);

    const applyPose = (eased: number) => {
      for (let i = 0; i < NODE_COUNT; i++) {
        current[i].lerpVectors(startPositions[i], endPositions[i], eased);
        dummy.position.copy(current[i]);
        dummy.scale.setScalar(THREE.MathUtils.lerp(0.4, 1, eased));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      lineMat.opacity = eased > 0.75 ? 0.16 : 0;
      core.scale.setScalar(Math.max(0.001, THREE.MathUtils.lerp(0.55, 1, eased)));
      shellMat.opacity = THREE.MathUtils.lerp(0, 0.16, eased);
    };

    const mouse = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);

    let scrollProgress = 0;
    const onScroll = () => {
      scrollProgress = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const clock = new THREE.Clock();
    let startTime: number | null = null;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;
      if (startTime === null) startTime = elapsed;
      const t = Math.min((elapsed - startTime) / ASSEMBLE_DURATION, 1);
      applyPose(easeOutCubic(t));

      // Damped cursor parallax plus a scroll-linked turn, so the object feels physical.
      smooth.x += (mouse.x - smooth.x) * 0.03;
      smooth.y += (mouse.y - smooth.y) * 0.03;

      core.rotation.x += delta * 0.16;
      core.rotation.y += delta * 0.22;
      shell.rotation.y -= delta * 0.05;
      shell.rotation.x += delta * 0.02;
      dustNear.rotation.y += delta * 0.012;
      dustFar.rotation.y -= delta * 0.008;

      const breathe = 1 + Math.sin(elapsed * 0.5) * 0.02;
      group.scale.setScalar(breathe);
      group.rotation.y += delta * 0.04;
      group.rotation.x += (smooth.y * 0.12 - group.rotation.x) * 0.02;
      group.rotation.z += (-smooth.x * 0.15 - group.rotation.z) * 0.02;
      group.rotation.y += (scrollProgress * 0.6 - 0) * 0.02;
      renderer.render(scene, camera);
    };

    if (!reduced) tick();

    if (reduced) {
      applyPose(1);
      core.rotation.set(0.6, 0.8, 0);
      // Static pose, no motion. Repaint briefly so the still frame
      // reliably reaches the screen in every browser.
      let stillFrames = 0;
      const still = () => {
        renderer.render(scene, camera);
        if (++stillFrames < 90) raf = requestAnimationFrame(still);
      };
      raf = requestAnimationFrame(still);
    }

    const onResize = () => {
      const w = mount.clientWidth;
      const h = Math.max(mount.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting) {
          startTime = null;
          clock.getDelta();
          if (!raf) tick();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.02 },
    );
    io.observe(mount);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      dustNearGeo.dispose();
      dustNearMat.dispose();
      dustFarGeo.dispose();
      dustFarMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.07),transparent_62%)]" />
    </div>
  );
}
