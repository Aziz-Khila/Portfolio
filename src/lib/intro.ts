"use client";

import { useSyncExternalStore } from "react";

let done = false;
const listeners = new Set<() => void>();

export const intro = {
  isDone: () => done,
  complete() {
    if (done) return;
    done = true;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useIntroDone() {
  return useSyncExternalStore(intro.subscribe, intro.isDone, () => false);
}
