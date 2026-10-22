"use client";

import { useLayoutEffect } from "react";
import { useLocale } from "next-intl";
import { ScrollTrigger } from "@/lib/gsap";
import { motionMode } from "@/lib/motion";
import { scroll } from "@/lib/scroll";
import { themeMode } from "@/lib/theme";

function restoreDocumentPrefs() {
  const root = document.documentElement;
  const motionMissing = !root.hasAttribute("data-motion");
  const themeMissing = !root.hasAttribute("data-theme");
  if (!motionMissing && !themeMissing) return false;
  motionMode.ensure();
  themeMode.ensure();
  return motionMissing;
}

/**
 * Soft locale navigations re-render <html> from the server without data-motion /
 * data-theme, which strips the attrs the init scripts set. CSS then loses
 * motion-on layout while GSAP still runs full motion. Re-apply before paint.
 */
export function DocumentPrefs() {
  const locale = useLocale();

  useLayoutEffect(() => {
    if (!restoreDocumentPrefs()) return;
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      scroll.lenis?.resize();
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      if (!restoreDocumentPrefs()) return;
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        scroll.lenis?.resize();
      });
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-motion", "data-theme"] });
    return () => observer.disconnect();
  }, []);

  return null;
}
