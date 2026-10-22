"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { themeMode } from "@/lib/theme";
import { heroFragment, heroVertex } from "./hero-shader";

export type HeroGLState = { progress: number };

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, heroVertex);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, heroFragment);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

function voidColor(light: number): [number, number, number, number] {
  return [
    0.039 + (0.965 - 0.039) * light,
    0.039 + (0.957 - 0.039) * light,
    0.043 + (0.945 - 0.043) * light,
    1,
  ];
}

export function HeroGL({ state, className }: { state: HeroGLState; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false, depth: false });
    if (!canvas || !gl) return;
    const program = createProgram(gl);
    if (!program) return;

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      mouseStrength: gl.getUniformLocation(program, "uMouseStrength"),
      progress: gl.getUniformLocation(program, "uProgress"),
      light: gl.getUniformLocation(program, "uLight"),
    };

    const lightTarget = { value: themeMode.get() === "light" ? 1 : 0 };
    const lightCurrent = { value: lightTarget.value };
    const reduced = prefersReducedMotion();

    canvas.style.transition = "background-color 0.55s cubic-bezier(0.19, 1, 0.22, 1)";
    const syncCanvasCss = () => {
      canvas.style.backgroundColor = themeMode.get() === "light" ? "#f6f4f0" : "#0a0a0b";
    };
    syncCanvasCss();

    const mouse = { x: 0.62, y: 0.42, strength: 0 };
    const target = { x: 0.62, y: 0.42, strength: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
      target.strength = 1;
    };
    const onPointerLeave = () => {
      target.strength = 0;
    };

    let lastTime = performance.now();
    const draw = (time: number) => {
      const dt = Math.min(0.05, Math.max(0, (time - lastTime) / 1000));
      lastTime = time;
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      mouse.strength += (target.strength - mouse.strength) * 0.04;
      // ~0.55s ease toward the theme target so the field matches the CSS crossfade.
      const lightDelta = lightTarget.value - lightCurrent.value;
      if (Math.abs(lightDelta) < 0.001) lightCurrent.value = lightTarget.value;
      else lightCurrent.value += lightDelta * (1 - Math.exp(-7 * dt));
      gl.clearColor(...voidColor(lightCurrent.value));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, time / 1000);
      gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
      gl.uniform1f(uniforms.mouseStrength, mouse.strength);
      gl.uniform1f(uniforms.progress, state.progress);
      gl.uniform1f(uniforms.light, lightCurrent.value);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.ready = "true";
    };

    // The field is soft, so rendering below native resolution is invisible and much cheaper.
    // Always re-bind viewport + uResolution — even when buffer size is unchanged.
    // React Strict Mode remounts reuse the same canvas dimensions with a new program;
    // an early return here left uResolution at (0,0) so the field stayed black until a
    // real resize (often triggered by scroll/pin) finally re-ran this path.
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio, 1.5) * 0.6;
      const nextW = Math.max(1, Math.round(canvas.clientWidth * scale));
      const nextH = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      draw(lastTime);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    if (reduced) {
      const unsubTheme = themeMode.subscribe(() => {
        lightTarget.value = themeMode.get() === "light" ? 1 : 0;
        lightCurrent.value = lightTarget.value;
        syncCanvasCss();
        draw(performance.now());
      });
      draw(lastTime);
      return () => {
        resizeObserver.disconnect();
        unsubTheme();
      };
    }

    let frame = 0;
    let visible = true;
    let settling = false;
    const lightSettled = () => Math.abs(lightTarget.value - lightCurrent.value) < 0.001;
    const loop = (time: number) => {
      draw(time);
      if (settling && lightSettled()) settling = false;
      if (visible && !document.hidden || settling) {
        frame = requestAnimationFrame(loop);
      }
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if ((visible && !document.hidden) || settling) frame = requestAnimationFrame(loop);
    };

    const unsubTheme = themeMode.subscribe(() => {
      lightTarget.value = themeMode.get() === "light" ? 1 : 0;
      syncCanvasCss();
      settling = !lightSettled();
      sync();
    });

    // Observe the hero section — not the canvas. The entrance clip-path can make the
    // canvas report zero intersection until scroll, which previously blocked the loop.
    const section = canvas.closest("section") ?? canvas;
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "25% 0px" },
    );
    intersection.observe(section);

    // Start immediately so the field is ready before the clip-path reveal.
    visible = true;
    sync();
    draw(lastTime);

    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("webglcontextlost", () => cancelAnimationFrame(frame));

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      unsubTheme();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100 ${className ?? ""}`}
    />
  );
}
