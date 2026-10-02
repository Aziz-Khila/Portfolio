"use client";

import { useSyncExternalStore } from "react";
import { MOTION_STORAGE_KEY } from "./motion-script";

export type MotionMode = "full" | "reduced";

const listeners = new Set<() => void>();

function read(): MotionMode {
  if (typeof document === "undefined") return "full";
  return document.documentElement.dataset.motion === "reduced" ? "reduced" : "full";
}

export const motionMode = {
  get: read,
  set(mode: MotionMode) {
    if (mode === read()) return;
    document.documentElement.dataset.motion = mode;
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, mode);
    } catch {}
    listeners.forEach((listener) => listener());
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
