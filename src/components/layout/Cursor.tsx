"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Brand cursor: accent square + trailing ring.
 * Opt into a labelled state with `data-cursor="Label"`.
 */
export function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const ringEl = ring.current;
      const tipEl = tip.current;
      if (!fine || !el || !ringEl || !tipEl) return;
      document.documentElement.classList.add("has-cursor");

      const tipX = gsap.quickTo(tipEl, "x", { duration: 0.12, ease: "power3" });
      const tipY = gsap.quickTo(tipEl, "y", { duration: 0.12, ease: "power3" });
      const ringX = gsap.quickTo(ringEl, "x", { duration: 0.5, ease: "power3" });
      const ringY = gsap.quickTo(ringEl, "y", { duration: 0.5, ease: "power3" });

      const move = (e: PointerEvent) => {
        el.dataset.hidden = "false";
        tipX(e.clientX);
        tipY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const target = e.target as Element | null;
        const labelled = target?.closest<HTMLElement>("[data-cursor]");
        if (labelled) {
          el.dataset.state = "label";
          if (label.current) label.current.textContent = labelled.dataset.cursor ?? "";
        } else if (target?.closest("a, button, [role='button'], input, textarea, label, select")) {
          el.dataset.state = "link";
        } else {
          el.dataset.state = "";
        }
      };
      const leave = () => {
        el.dataset.hidden = "true";
      };

      window.addEventListener("pointermove", move);
      document.addEventListener("pointerover", over);
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        document.documentElement.classList.remove("has-cursor");
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [fine] },
  );

  if (!fine) return null;

  return (
    <div ref={root} className="cursor" data-hidden="true" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={tip} className="cursor-dot" />
    </div>
  );
}
