"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { motionMode } from "@/lib/motion";
import { scroll, scrollToTarget } from "@/lib/scroll";

type Anchor = { id: string } | { ratio: number };

function captureAnchor(): Anchor {
  const middle = window.innerHeight / 2;
  let current: HTMLElement | null = null;
  for (const section of document.querySelectorAll<HTMLElement>("main section[id]")) {
    if (section.getBoundingClientRect().top <= middle) current = section;
  }
  if (current) return { id: current.id };
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return { ratio: max > 0 ? window.scrollY / max : 0 };
}

function restoreAnchor(anchor: Anchor) {
  if ("id" in anchor) {
    scrollToTarget(anchor.id === "top" ? 0 : `#${anchor.id}`, { immediate: true });
    return;
  }
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollToTarget(Math.round(anchor.ratio * max), { immediate: true });
}

/**
 * Every animation decides once, on mount, whether motion is on. Remounting the
 * tree when the switch flips lets them all tear down and rebuild cleanly.
 */
export function MotionBoundary({ children }: { children: ReactNode }) {
  const [generation, setGeneration] = useState(0);
  const anchor = useRef<Anchor | null>(null);

  useEffect(
    () =>
      motionMode.subscribe(() => {
        anchor.current = captureAnchor();
        setGeneration((value) => value + 1);
      }),
    [],
  );

  useEffect(() => {
    const target = anchor.current;
    if (!generation || !target) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        scroll.lenis?.resize();
        restoreAnchor(target);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [generation]);

  return <Fragment key={generation}>{children}</Fragment>;
}
