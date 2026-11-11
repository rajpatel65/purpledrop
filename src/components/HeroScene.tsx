import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** A single authored brand object. Decorative: no claims or controls live in the canvas. */
export function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { return; } // The poster remains visible when WebGL is unavailable.
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, Math.max(1, mount.clientHeight));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / Math.max(1, mount.clientHeight), 0.1, 50);
    camera.position.set(0, 0.25, 8.8);
    camera.lookAt(0, 0.2, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    const key = new THREE.DirectionalLight(0xfff3e4, 4);
    key.position.set(-3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xa68bff, 3);
    rim.position.set(3, 1, -2); scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x24113f, 1.4));

    // Curved lathe profile, not a stock knot: broad belly, drawn-out point, rounded base.
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,-1.45,0), new THREE.Vector3(0.58,-1.34,0),
      new THREE.Vector3(1.04,-0.96,0), new THREE.Vector3(1.17,-0.35,0),
      new THREE.Vector3(1.01,0.35,0), new THREE.Vector3(0.62,1.05,0),
      new THREE.Vector3(0.22,1.75,0), new THREE.Vector3(0,2.28,0),
    ]);
    const profile = curve.getPoints(72).map(p => new THREE.Vector2(Math.max(0,p.x),p.y));
    const geometry = new THREE.LatheGeometry(profile, 96);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x7852bd, metalness: 0.92, roughness: 0.17,
      clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 1.65,
    });
    const drop = new THREE.Mesh(geometry, material);
    const group = new THREE.Group(); group.add(drop); scene.add(group);
    drop.rotation.z = -0.18;
    group.scale.setScalar(0.82);

    const textureCanvas = document.createElement('canvas'); textureCanvas.width = textureCanvas.height = 128;
    const context = textureCanvas.getContext('2d');
    if (context) { const gradient = context.createRadialGradient(64,64,2,64,64,64); gradient.addColorStop(0,'rgba(6,2,17,0.6)'); gradient.addColorStop(1,'rgba(6,2,17,0)'); context.fillStyle=gradient; context.fillRect(0,0,128,128); }
    const shadowTexture = new THREE.CanvasTexture(textureCanvas);
    const shadowGeometry = new THREE.PlaneGeometry(4.8,1.15);
    const shadowMaterial = new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,opacity:0.7});
    const shadow = new THREE.Mesh(shadowGeometry,shadowMaterial); shadow.position.set(0,-1.85,-0.1); scene.add(shadow);

    const pointer = {x:0,y:0}; let progress=0; let raf=0; let visible=false; let start=0;
    let settled=false; let lastFrame=0;
    const pose = (time:number) => {
      const t = motion.matches ? 1 : Math.min((time-start)/1500,1);
      const ease=1-Math.pow(1-t,4);
      group.position.y = 0.12 + (1-ease)*0.38;
      group.rotation.y = -0.32 + (1-ease)*0.5 + pointer.x*0.12 + progress*0.3;
      group.rotation.x = pointer.y*0.07 + progress*0.08;
      group.rotation.z = -0.08*ease;
      settled=t===1;
      renderer.render(scene,camera);
      mount.dataset.rendered='true';
    };
    const tick=(time:number)=> {
      raf=0;
      if (!visible || document.hidden) return;
      // Deliberately settles to a still frame, no endless idle spin.
      if (time-lastFrame>30 || settled) { pose(time);lastFrame=time; }
      if(!settled&&!motion.matches) raf=requestAnimationFrame(tick);
    };
    const repaint=()=> { if(!raf&&visible&&!document.hidden) raf=requestAnimationFrame(tick); };
    const onPointer=(e:PointerEvent)=> { if(motion.matches||e.pointerType==='touch')return; const b=mount.getBoundingClientRect();pointer.x=THREE.MathUtils.clamp((e.clientX-b.left)/b.width-0.5,-0.5,0.5);pointer.y=THREE.MathUtils.clamp((e.clientY-b.top)/b.height-0.5,-0.5,0.5);repaint(); };
    const onScroll=()=> { if(motion.matches)return; const b=mount.getBoundingClientRect(); progress=THREE.MathUtils.clamp(-b.top/Math.max(b.height,1),0,1);repaint(); };
    const resize=()=> { camera.aspect=mount.clientWidth/Math.max(mount.clientHeight,1);camera.updateProjectionMatrix();renderer.setSize(mount.clientWidth,Math.max(mount.clientHeight,1));repaint(); };
    const onMotion=()=> {pointer.x=pointer.y=progress=0;settled=motion.matches;repaint();};
    const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else repaint();};
    const onLoss=(e:Event)=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;setReady(false);};
    const io = new IntersectionObserver(([e])=>{ visible=e.isIntersecting;if(visible){if(!start)start=performance.now();repaint();}else{cancelAnimationFrame(raf);raf=0;} },{threshold:0.01});
    io.observe(mount);
    const ro=new ResizeObserver(resize);ro.observe(mount);
    window.addEventListener('pointermove',onPointer,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});
    document.addEventListener('visibilitychange',onVisibility);motion.addEventListener('change',onMotion);
    renderer.domElement.addEventListener('webglcontextlost',onLoss);
    pose(performance.now()+1500);setReady(true); settled=false;
    return()=>{io.disconnect();ro.disconnect();cancelAnimationFrame(raf);window.removeEventListener('pointermove',onPointer);window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',onVisibility);motion.removeEventListener('change',onMotion);renderer.domElement.removeEventListener('webglcontextlost',onLoss);geometry.dispose();material.dispose();shadowGeometry.dispose();shadowMaterial.dispose();shadowTexture.dispose();environment.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div aria-hidden="true" className="absolute inset-0">
    <img src="/drop-poster.svg" alt="" className={`absolute inset-0 h-full w-full object-contain ${ready?'opacity-0':'opacity-100'}`} />
    <div ref={mountRef} className={`absolute inset-0 ${ready?'opacity-100':'opacity-0'}`} />
  </div>;
      }
