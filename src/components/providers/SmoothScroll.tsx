"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { intro } from "@/lib/intro";
import { scroll } from "@/lib/scroll";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: false });
    scroll.lenis = lenis;

    // One loop: GSAP's ticker drives Lenis, and every Lenis frame updates ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (!intro.isDone()) lenis.stop();
    const unsubscribe = intro.subscribe(() => lenis.start());

    return () => {
      unsubscribe();
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroll.lenis = null;
    };
  }, []);

  return <>{children}</>;
}
