"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

export function Counter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const state = { n: 0 };
    el.textContent = "0";
    gsap.to(state, {
      n: value,
      duration: 2,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = String(Math.round(state.n));
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
