"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";
import { getScrollVelocity } from "@/lib/scroll";
import { workRegistry } from "@/lib/work-registry";
import { projects } from "@/content/projects";
import { mediaFragment, mediaVertex } from "./shaders";

const CAMERA_Z = 800;
const { damp, clamp } = THREE.MathUtils;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Keeps 1 world unit equal to 1 CSS pixel at z = 0, so planes can mirror DOM rects. */
function PixelCamera() {
  const lastHeight = useRef(0);
  useFrame(({ camera, size }) => {
    if (lastHeight.current === size.height) return;
    lastHeight.current = size.height;
    const perspective = camera as THREE.PerspectiveCamera;
    perspective.fov = (2 * Math.atan(size.height / 2 / CAMERA_Z) * 180) / Math.PI;
    perspective.updateProjectionMatrix();
  });
  return null;
}

function MediaPlane({ slug, poster }: { slug: string; poster: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const videoTexture = useRef<THREE.VideoTexture | null>(null);
  const revealed = useRef(false);
  const posterTexture = useLoader(THREE.TextureLoader, poster);

  const uniforms = useMemo(
    () => ({
      uPoster: { value: posterTexture },
      uVideo: { value: null as THREE.Texture | null },
      uVideoMix: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: 0 },
      uReveal: { value: 0 },
      uTime: { value: 0 },
      uPlane: { value: new THREE.Vector2(1, 1) },
      uMedia: { value: new THREE.Vector2(1280, 720) },
      uAccent: { value: new THREE.Color("#ff5a1f") },
    }),
    [posterTexture],
  );

  useEffect(() => {
    const holder = videoTexture;
    return () => holder.current?.dispose();
  }, []);

  useFrame((state, delta) => {
    const entry = workRegistry.get(slug);
    const plane = mesh.current;
    const mat = material.current;
    if (!entry || !plane || !mat) return;

    const { width: vw, height: vh } = state.size;
    const rect = entry.el.getBoundingClientRect();
    plane.visible = rect.right > -100 && rect.left < vw + 100 && rect.bottom > 0 && rect.top < vh;
    if (!plane.visible) return;

    plane.scale.set(rect.width, rect.height, 1);
    plane.position.set(rect.left + rect.width / 2 - vw / 2, vh / 2 - (rect.top + rect.height / 2), 0);

    if (!revealed.current && rect.left < vw * 0.92 && rect.top < vh * 0.92) revealed.current = true;

    if (!videoTexture.current) {
      videoTexture.current = new THREE.VideoTexture(entry.video);
      mat.uniforms.uVideo.value = videoTexture.current;
    }
    const playing = entry.video.readyState >= 2 && !entry.video.paused;

    const u = mat.uniforms;
    u.uReveal.value = damp(u.uReveal.value, revealed.current ? 1.15 : 0, 1.8, delta);
    u.uVelocity.value = damp(u.uVelocity.value, clamp(getScrollVelocity() / 35, -1, 1), 5, delta);
    u.uHover.value = damp(u.uHover.value, entry.hover ? 1 : 0, 4, delta);
    u.uVideoMix.value = damp(u.uVideoMix.value, entry.hover && playing ? 1 : 0, 5, delta);
    u.uMouse.value.set(
      damp(u.uMouse.value.x, entry.mouse.x, 8, delta),
      damp(u.uMouse.value.y, entry.mouse.y, 8, delta),
    );
    u.uPlane.value.set(rect.width, rect.height);
    u.uTime.value += delta;
  });

  return (
    <mesh ref={mesh} visible={false}>
      <planeGeometry args={[1, 1, 48, 24]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={mediaVertex}
        fragmentShader={mediaFragment}
        transparent
      />
    </mesh>
  );
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

export default function WorkGL({
  section,
  onReady,
}: {
  section: RefObject<HTMLElement | null>;
  onReady: () => void;
}) {
  const [supported] = useState(supportsWebGL);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!supported || !section.current) return;
    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => setActive(self.isActive),
    });
    return () => trigger.kill();
  }, [section, supported]);

  if (!supported) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ visibility: active ? "visible" : "hidden" }}
    >
      <Canvas
        style={{ pointerEvents: "none" }}
        flat
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, CAMERA_Z], near: 1, far: 4000 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <PixelCamera />
        <Suspense fallback={null}>
          {projects.map((project) => (
            <MediaPlane key={project.slug} slug={project.slug} poster={project.poster} />
          ))}
          <ReadySignal onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
