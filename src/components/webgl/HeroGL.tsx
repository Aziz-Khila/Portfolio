"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
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
    };

    // The field is soft, so rendering below native resolution is invisible and much cheaper.
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio, 1.5) * 0.6;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

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

    const draw = (time: number) => {
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      mouse.strength += (target.strength - mouse.strength) * 0.04;
      gl.uniform1f(uniforms.time, time / 1000);
      gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
      gl.uniform1f(uniforms.mouseStrength, mouse.strength);
      gl.uniform1f(uniforms.progress, state.progress);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (prefersReducedMotion()) {
      draw(12000);
      canvas.dataset.ready = "true";
      return () => resizeObserver.disconnect();
    }

    let frame = 0;
    let visible = true;
    const loop = (time: number) => {
      draw(time);
      canvas.dataset.ready = "true";
      frame = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("webglcontextlost", () => cancelAnimationFrame(frame));

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
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
