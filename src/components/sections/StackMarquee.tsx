"use client";

import clsx from "clsx";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { getScrollVelocity } from "@/lib/scroll";
import { marqueeStack } from "@/content/skills";

function Row({ items, outline }: { items: string[]; outline?: boolean }) {
  return (
    <div data-row className="flex w-max will-change-transform">
      {[0, 1].map((copy) => (
        <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
          {items.map((name) => (
            <span
              key={name}
              className={clsx(
                "display flex items-center whitespace-nowrap text-[clamp(3rem,9vw,9.5rem)]",
                outline && "text-outline",
              )}
            >
              {name}
              <span className="mx-[0.35em] text-[0.32em] text-accent" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Two marquee rows whose speed, direction and skew follow the scroll velocity when motion is on. */
export function StackMarquee() {
  const t = useTranslations("stack");
  const root = useRef<HTMLElement>(null);
  const names = marqueeStack.map((item) => item.name);

  useGSAP(
    () => {
      // With motion off the rows still drift at a steady pace, without scroll boost or skew.
      const reduced = prefersReducedMotion();
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      const setters = rows.map((row) => gsap.quickSetter(row, "xPercent"));
      const skewTo = gsap.quickTo("[data-rows]", "skewX", { duration: 0.5, ease: "power3" });
      const wrap = gsap.utils.wrap(-50, 0);
      let position = 0;
      let direction = 1;

      const tick = (_time: number, deltaMs: number) => {
        const velocity = reduced ? 0 : getScrollVelocity();
        if (Math.abs(velocity) > 0.5) direction = velocity > 0 ? 1 : -1;
        const boost = Math.min(Math.abs(velocity) * 0.012, 0.4);
        position += direction * (0.018 + boost) * (deltaMs / 16.67);
        setters[0]?.(wrap(-position));
        setters[1]?.(wrap(position - 25));
        if (!reduced) skewTo(gsap.utils.clamp(-10, 10, -velocity * 0.35));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label={t("label")}
      className="relative overflow-hidden border-y border-line py-[6vh]"
    >
      <p className="sr-only">{names.join(", ")}</p>
      <div data-rows aria-hidden="true" className="space-y-1">
        <Row items={names} />
        <Row items={[...names].reverse()} outline />
      </div>
    </section>
  );
}
