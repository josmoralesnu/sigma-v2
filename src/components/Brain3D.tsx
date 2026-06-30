import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { Plus, Minus, Move3d } from "lucide-react";
import * as THREE from "three";
import { accentHex } from "../lib/data";

/* Cerebro holográfico (GLB de partículas emisivas) con pulsos de color.
   Las partículas usan additive blending → necesitan un escenario OSCURO para
   tener contraste. <BrainStage> provee ese escenario inmersivo dentro del tema claro.
   Modo `interactive`: orbitar con el mouse + zoom. */

const MODEL_URL = "/brain_hologram.glb";

interface MatRef {
  m: THREE.MeshStandardMaterial;
  h: number; s: number; l: number;
  gold: boolean;
}

function BrainModel({ thinking, spin, accent }: { thinking: boolean; spin: boolean; accent: string }) {
  const root = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, root);

  // tono base derivado del acento de marca (rojo Copec / naranja Betsson), calculado una sola vez
  const accentHSL = useMemo(() => {
    const c = new THREE.Color(accent);
    const hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    return hsl;
  }, [accent]);

  // Centrado robusto: el GLB tiene vértices dispersos (outliers) que inflan el
  // bounding box → centro corrido y escala chica. Usamos el CENTROIDE de los
  // vértices (no el centro del box) y la escala desde el percentil 92 del radio,
  // así el cerebro queda centrado y llena el escenario.
  const fit = useMemo(() => {
    let cx = 0, cy = 0, cz = 0, n = 0;
    const verts: number[] = [];
    scene.updateWorldMatrix(true, true);
    const v = new THREE.Vector3();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.geometry) return;
      const pos = mesh.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (!pos) return;
      mesh.updateWorldMatrix(true, false);
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
        verts.push(v.x, v.y, v.z);
        cx += v.x; cy += v.y; cz += v.z; n++;
      }
    });
    if (!n) return { scale: 1, offset: new THREE.Vector3() };
    const center = new THREE.Vector3(cx / n, cy / n, cz / n);
    const dists = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const dx = verts[i * 3] - center.x, dy = verts[i * 3 + 1] - center.y, dz = verts[i * 3 + 2] - center.z;
      dists[i] = Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    dists.sort();
    const r = dists[Math.floor(n * 0.92)] || dists[n - 1] || 1;
    const scale = 1.25 / r; // radio del 92% de los puntos → ~1.25 unidades (llena el frame)
    return { scale, offset: center.clone().multiplyScalar(-scale) };
  }, [scene]);

  const mats = useMemo<MatRef[]>(() => {
    const out: MatRef[] = [];
    const seen = new Set<string>();
    let idx = 0;
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
        // tono base = acento de marca; cada 3er material es un núcleo blanco-incandescente
        const gold = idx % 3 === 2;
        out.push({
          m: sm,
          h: accentHSL.h,
          s: gold ? accentHSL.s * 0.45 : Math.min(1, accentHSL.s + 0.05),
          l: gold ? 0.82 : Math.max(0.55, accentHSL.l + 0.05),
          gold,
        });
        idx++;
      });
    });
    return out;
  }, [scene, accentHSL]);

  useEffect(() => {
    Object.values(actions).forEach((a) => a?.reset().play());
  }, [actions]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (root.current && spin) {
      root.current.rotation.y += delta * (thinking ? 0.55 : 0.16);
      root.current.rotation.x = -0.08 + Math.sin(t * 0.3) * 0.05;
    }
    const base = thinking ? 2.6 : 1.75;
    for (let i = 0; i < mats.length; i++) {
      const mm = mats[i];
      const pulse = thinking
        ? 0.5 + 0.6 * Math.abs(Math.sin(t * 2.3 + i * 1.7))
        : 0.62 + 0.3 * Math.sin(t * 0.85 + i * 1.3);
      mm.m.emissiveIntensity = base * (0.6 + pulse);
      if (thinking) {
        // ondas de color recorriendo la malla, oscilando alrededor del acento de marca
        const h = (mm.h + 0.04 * Math.sin(t * 0.8 + i) + 1) % 1;
        mm.m.emissive.setHSL(h, mm.s, Math.min(0.9, mm.l + 0.06 * Math.sin(t * 1.6 + i)));
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

function Glow({ thinking, accent }: { thinking: boolean; accent: string }) {
  const inner = useRef<THREE.MeshBasicMaterial>(null!);
  const outer = useRef<THREE.MeshBasicMaterial>(null!);
  // halo interior = tinte más brillante del acento; exterior = acento suave
  const { innerColor, outerColor } = useMemo(() => {
    const base = new THREE.Color(accent);
    const hsl = { h: 0, s: 0, l: 0 };
    base.getHSL(hsl);
    const ic = new THREE.Color().setHSL(hsl.h, Math.max(0, hsl.s - 0.15), Math.min(1, hsl.l + 0.18));
    const oc = base.clone();
    return { innerColor: ic, outerColor: oc };
  }, [accent]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = thinking ? 0.6 + 0.4 * Math.abs(Math.sin(t * 2.0)) : 0.72 + 0.22 * Math.sin(t * 0.85);
    if (inner.current) inner.current.opacity = (thinking ? 0.34 : 0.22) * p;
    if (outer.current) outer.current.opacity = (thinking ? 0.16 : 0.1) * p;
  });
  return (
    <group>
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial ref={inner} color={innerColor} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh scale={2.4}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial ref={outer} color={outerColor} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export function Brain3D({ size = 200, thinking = false, interactive = false, accent = accentHex }: { size?: number; thinking?: boolean; interactive?: boolean; accent?: string }) {
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
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ background: "transparent", position: "relative", cursor: interactive ? "grab" : "default" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 1, 3]} intensity={1.1} color={accent} />
        <Glow thinking={thinking} accent={accent} />
        <Suspense fallback={null}>
          <BrainModel thinking={thinking} spin={!interactive || thinking} accent={accent} />
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
          <div className="absolute bottom-2 right-2 flex flex-col gap-1">
            <button onClick={() => zoomBy(0.82)} className="grid h-7 w-7 place-items-center rounded-lg border border-white/15 bg-white/10 text-white/80 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white" title="Acercar"><Plus size={14} /></button>
            <button onClick={() => zoomBy(1.22)} className="grid h-7 w-7 place-items-center rounded-lg border border-white/15 bg-white/10 text-white/80 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white" title="Alejar"><Minus size={14} /></button>
          </div>
          <div className="pointer-events-none absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 font-mono text-[9px] text-white/70 backdrop-blur-md">
            <Move3d size={11} className="text-rose" /> arrastra para girar
          </div>
        </>
      )}
    </div>
  );
}

/* Escenario oscuro inmersivo: da contraste y protagonismo al cerebro dentro del tema claro.
   `variant` ajusta el redondeo (panel hero vs. disco dentro del canvas de flow). */
export function BrainStage({
  children,
  thinking = false,
  className = "",
  variant = "panel",
  style,
}: {
  children: ReactNode;
  thinking?: boolean;
  className?: string;
  variant?: "panel" | "disc";
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={"brain-stage " + className}
      style={{ borderRadius: variant === "disc" ? "9999px" : undefined, ...style }}
    >
      <div className="brain-stage-dots" />
      <div className={"brain-bloom" + (thinking ? " is-thinking" : "")} />
      {/* anillos orbitales (visibles sobre el escenario oscuro) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/30 spin-slow" style={{ borderStyle: "dashed" }} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 spin-rev" style={{ borderStyle: "dotted" }} />
      {children}
    </div>
  );
}

useGLTF.preload(MODEL_URL);
