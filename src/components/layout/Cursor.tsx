"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Elements opt into a labelled cursor with `data-cursor="Label"`.
 * Links and buttons get a subtle grow state automatically.
 */
export function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!fine || !el) return;
      document.documentElement.classList.add("has-cursor");
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

      const move = (e: PointerEvent) => {
        el.dataset.hidden = "false";
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const target = e.target as Element | null;
        const labelled = target?.closest<HTMLElement>("[data-cursor]");
        if (labelled) {
          el.dataset.state = "label";
          if (label.current) label.current.textContent = labelled.dataset.cursor ?? "";
        } else if (target?.closest("a, button, [role='button'], input, textarea, label")) {
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
    <div ref={ref} className="cursor" data-hidden="true" aria-hidden="true">
      <div className="cursor-dot">
        <span ref={label} className="cursor-label" />
      </div>
    </div>
  );
}
