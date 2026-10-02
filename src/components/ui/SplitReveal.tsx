"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, whenMotion } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";

type Props = {
  as?: "div" | "p" | "span" | "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  start?: string;
  id?: string;
};

const defaultStagger = { lines: 0.09, words: 0.035, chars: 0.022 };

/** Masked line/word/char reveal that plays once when the element scrolls into view. */
export function SplitReveal({
  as = "div",
  children,
  className,
  type = "lines",
  delay = 0,
  stagger,
  start = "top 88%",
  id,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useIntroDone();
  const Tag = as as "div";

  useGSAP(
    () => {
      if (!ready || !ref.current) return;
      const el = ref.current;
      const mm = gsap.matchMedia();
      mm.add(whenMotion(), () => {
        const split = SplitText.create(el, {
          type: type === "lines" ? "lines" : `lines,${type}`,
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            const targets =
              type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
            return gsap.from(targets, {
              yPercent: 115,
              duration: 1.3,
              delay,
              stagger: stagger ?? defaultStagger[type],
              scrollTrigger: { trigger: el, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
