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

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Nodes: scattered cloud that assembles onto a sphere surface
    const endPositions = fibonacciSphere(NODE_COUNT, RADIUS);
    const startPositions = endPositions.map(() => scatterPoint(SCATTER_SPREAD));
    const current = startPositions.map((p) => p.clone());

    const mesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.05, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x6d28d9 }),
      NODE_COUNT,
    );
    const dummy = new THREE.Object3D();
    group.add(mesh);

    // Connection lines between nodes that land near each other
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

    const applyPose = (eased: number) => {
      for (let i = 0; i < NODE_COUNT; i++) {
        current[i].lerpVectors(startPositions[i], endPositions[i], eased);
        dummy.position.copy(current[i]);
        dummy.scale.setScalar(THREE.MathUtils.lerp(0.4, 1, eased));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      lineMat.opacity = eased > 0.75 ? 0.2 : 0;
    };

    if (reduced) {
      applyPose(1);
      renderer.render(scene, camera);
    }

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);

    const clock = new THREE.Clock();
    let startTime: number | null = null;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const delta = clock.getDelta();
      if (startTime === null) startTime = clock.elapsedTime;
      const t = Math.min((clock.elapsedTime - startTime) / ASSEMBLE_DURATION, 1);
      applyPose(easeOutCubic(t));

      group.rotation.y += delta * 0.04;
      group.rotation.x += (mouse.y * 0.12 - group.rotation.x) * 0.02;
      group.rotation.z += (-mouse.x * 0.15 - group.rotation.z) * 0.02;
      renderer.render(scene, camera);
    };

    if (!reduced) tick();

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
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      mesh.geometry.dispose();
      mesh.material.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.07),transparent_62%)]" />
    </div>
  );
}
