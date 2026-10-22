"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./theme-script";

export type ThemeMode = "dark" | "light";

const listeners = new Set<() => void>();

function read(): ThemeMode {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function resolve(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function syncFavicon(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const file = mode === "light" ? "/media/khila-icon-light.svg" : "/media/khila-icon.svg";
  let link = document.querySelector<HTMLLinkElement>("link[data-theme-icon]");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.dataset.themeIcon = "1";
    document.head.appendChild(link);
  }
  // Cache-bust so the tab icon swaps immediately on theme change.
  link.href = `${file}?v=${mode}`;
}

export const themeMode = {
  get: read,
  set(mode: ThemeMode) {
    if (mode === read() && document.documentElement.dataset.theme === mode) return;
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    syncFavicon(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {}
    listeners.forEach((listener) => listener());
  },
  /** Re-apply after soft navigations that strip data-* from <html>. */
  ensure() {
    if (typeof document === "undefined") return;
    const mode = resolve();
    const before = read();
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    syncFavicon(mode);
    if (before !== mode) listeners.forEach((listener) => listener());
  },
  toggle() {
    themeMode.set(read() === "dark" ? "light" : "dark");
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useThemeMode() {
  return useSyncExternalStore(themeMode.subscribe, themeMode.get, () => "dark" as const);
}

if (typeof document !== "undefined") {
  syncFavicon(read());
}
