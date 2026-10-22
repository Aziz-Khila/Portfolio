"use client";

import { useSyncExternalStore } from "react";
import { MOTION_STORAGE_KEY } from "./motion-script";

export type MotionMode = "full" | "reduced";

const listeners = new Set<() => void>();

function read(): MotionMode {
  if (typeof document === "undefined") return "full";
  return document.documentElement.dataset.motion === "reduced" ? "reduced" : "full";
}

function resolve(): MotionMode {
  try {
    const stored = localStorage.getItem(MOTION_STORAGE_KEY);
    if (stored === "full" || stored === "reduced") return stored;
  } catch {}
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
}

export const motionMode = {
  get: read,
  set(mode: MotionMode) {
    if (mode === read() && document.documentElement.dataset.motion === mode) return;
    document.documentElement.dataset.motion = mode;
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, mode);
    } catch {}
    listeners.forEach((listener) => listener());
  },
  /** Re-apply after soft navigations that strip data-* from <html>. */
  ensure() {
    if (typeof document === "undefined") return;
    const mode = resolve();
    const before = read();
    document.documentElement.dataset.motion = mode;
    if (before !== mode) listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useMotionMode() {
  return useSyncExternalStore(motionMode.subscribe, motionMode.get, () => "full" as const);
}
