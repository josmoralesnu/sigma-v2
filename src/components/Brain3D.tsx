import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { Plus, Minus, Move3d } from "lucide-react";
import * as THREE from "three";

/* Cerebro holográfico (GLB de partículas emisivas) con pulsos de color.
   Modo `interactive`: orbitar con el mouse + zoom. Un backdrop radial detrás
   enmascara la grilla de fondo para que no se vea el "cuadrado". */

const MODEL_URL = "/brain_hologram.glb";

interface MatRef {
  m: THREE.MeshStandardMaterial;
  h: number; s: number; l: number;
}

function BrainModel({ thinking, spin }: { thinking: boolean; spin: boolean }) {
  const root = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, root);

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.3 / maxDim;
    return { scale, offset: center.clone().multiplyScalar(-scale) };
  }, [scene]);

  const mats = useMemo<MatRef[]>(() => {
    const out: MatRef[] = [];
    const seen = new Set<string>();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      list.forEach((mat) => {
        const sm = mat as THREE.MeshStandardMaterial;
        if (!sm || seen.has(sm.uuid)) return;
        seen.add(sm.uuid);
        sm.toneMapped = false;
        sm.transparent = true;
        sm.depthWrite = false;
        sm.blending = THREE.AdditiveBlending;
        // forzamos el tono vino (el GLB trae partículas cian) — h≈0.96 = claret
        out.push({ m: sm, h: 0.96, s: 0.85, l: 0.56 });
      });
    });
    return out;
  }, [scene]);

  useEffect(() => {
    Object.values(actions).forEach((a) => a?.reset().play());
  }, [actions]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (root.current && spin) {
      root.current.rotation.y += delta * (thinking ? 0.5 : 0.18);
      root.current.rotation.x = -0.08 + Math.sin(t * 0.3) * 0.05;
    }
    const base = thinking ? 1.9 : 1.05;
    for (let i = 0; i < mats.length; i++) {
      const mm = mats[i];
      const pulse = thinking
        ? 0.45 + 0.55 * Math.abs(Math.sin(t * 2.2 + i * 1.7))
        : 0.6 + 0.25 * Math.sin(t * 0.9 + i * 1.3);
      mm.m.emissiveIntensity = base * (0.55 + pulse);
      if (thinking) {
        const h = (mm.h + 0.05 * Math.sin(t * 0.7 + i) + 1) % 1;
        mm.m.emissive.setHSL(h, mm.s, mm.l);
      } else {
        mm.m.emissive.setHSL(mm.h, mm.s, mm.l);
      }
    }
  });

  return (
    <group ref={root}>
      <group scale={fit.scale} position={[fit.offset.x, fit.offset.y, fit.offset.z]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function Glow({ thinking }: { thinking: boolean }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = thinking ? 0.6 + 0.4 * Math.abs(Math.sin(t * 2.0)) : 0.7 + 0.2 * Math.sin(t * 0.9);
    if (mat.current) mat.current.opacity = (thinking ? 0.12 : 0.07) * pulse;
  });
  return (
    <mesh scale={2.0}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial ref={mat} color="#cf4d6b" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
    </mesh>
  );
}

export function Brain3D({ size = 200, thinking = false, interactive = false }: { size?: number; thinking?: boolean; interactive?: boolean }) {
  const controls = useRef<any>(null);

  const zoomBy = (f: number) => {
    const c = controls.current;
    if (!c) return;
    const cam = c.object as THREE.Camera & { position: THREE.Vector3 };
    const off = cam.position.clone().sub(c.target);
    const d = Math.min(Math.max(off.length() * f, c.minDistance ?? 1.8), c.maxDistance ?? 6);
    off.setLength(d);
    cam.position.copy(c.target).add(off);
    c.update();
  };

  return (
    <div className="relative" style={{ width: size, height: size, pointerEvents: interactive ? "auto" : "none" }}>
      {/* backdrop radial: enmascara la grilla de fondo (sin "cuadrado") */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          background: "radial-gradient(circle, var(--color-void) 34%, color-mix(in srgb, var(--color-void) 78%, transparent) 55%, transparent 72%)",
        }}
      />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ background: "transparent", position: "relative", cursor: interactive ? "grab" : "default" }}
      >
        <ambientLight intensity={0.5} />
        <Glow thinking={thinking} />
        <Suspense fallback={null}>
          <BrainModel thinking={thinking} spin={!interactive || thinking} />
        </Suspense>
        {interactive && (
          <OrbitControls
            ref={controls}
            makeDefault
            enablePan={false}
            enableZoom
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.55}
            autoRotate={!thinking}
            autoRotateSpeed={0.55}
            minDistance={1.9}
            maxDistance={6}
          />
        )}
      </Canvas>

      {interactive && (
        <>
          <div className="absolute bottom-1 right-1 flex flex-col gap-1">
            <button onClick={() => zoomBy(0.82)} className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-surface/80 text-ink-soft backdrop-blur-md transition-colors hover:border-cyan/40 hover:text-cyan" title="Acercar"><Plus size={14} /></button>
            <button onClick={() => zoomBy(1.22)} className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-surface/80 text-ink-soft backdrop-blur-md transition-colors hover:border-cyan/40 hover:text-cyan" title="Alejar"><Minus size={14} /></button>
          </div>
          <div className="pointer-events-none absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full border border-line bg-surface/70 px-2 py-1 font-mono text-[9px] text-ink-mute backdrop-blur-md">
            <Move3d size={11} className="text-cyan" /> arrastra para girar
          </div>
        </>
      )}
    </div>
  );
}

useGLTF.preload(MODEL_URL);
