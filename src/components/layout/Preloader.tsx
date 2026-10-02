"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { intro } from "@/lib/intro";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/content/site";

export function Preloader() {
  const t = useTranslations("preloader");
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => !intro.isDone());

  useGSAP(
    () => {
      const el = root.current;
      if (!el || intro.isDone()) return;
      const html = document.documentElement;
      history.scrollRestoration = "manual";
      html.classList.add("is-loading");

      const finish = () => {
        html.classList.remove("is-loading");
        intro.complete();
        if (location.hash) {
          requestAnimationFrame(() => scrollToTarget(location.hash, { immediate: true }));
        }
      };

      if (prefersReducedMotion()) {
        gsap.delayedCall(0.2, () => {
          finish();
          setVisible(false);
        });
        return;
      }

      const count = el.querySelector<HTMLElement>("[data-count]")!;
      const progress = { value: 0 };
      const tl = gsap.timeline({ paused: true, onComplete: () => setVisible(false) });

      tl.from("[data-word]", { yPercent: 115, duration: 1.1, stagger: 0.06 }, 0)
        .to(
          progress,
          {
            value: 100,
            duration: 1.9,
            ease: "power3.inOut",
            onUpdate: () => {
              count.textContent = String(Math.round(progress.value)).padStart(3, "0");
            },
          },
          0,
        )
        .to("[data-bar]", { scaleX: 1, duration: 1.9, ease: "power3.inOut" }, 0)
        .addLabel("exit")
        .to(
          "[data-word], [data-count], [data-meta]",
          { yPercent: -115, duration: 0.7, ease: "expo.in", stagger: 0.03 },
          "exit",
        )
        .to("[data-bar]", { scaleX: 0, transformOrigin: "right", duration: 0.6, ease: "expo.in" }, "exit")
        .call(finish, [], "exit+=0.75")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "exit+=0.5");

      const start = () => tl.play();
      const fallback = gsap.delayedCall(2.5, start);
      document.fonts.ready.then(() => {
        fallback.kill();
        start();
      });
    },
    { scope: root },
  );

  if (!visible) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[95] flex flex-col justify-between bg-ink p-[clamp(1.25rem,4vw,4rem)]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div className="flex justify-between overflow-hidden">
        <span data-meta className="label block">
          {t("label")}
        </span>
        <span data-meta className="label block">
          {t("edition")}
        </span>
      </div>

      <div>
        <p className="display flex flex-wrap gap-x-[0.25em] text-[clamp(2.75rem,9vw,9rem)]">
          {[site.firstName, site.lastName].map((word) => (
            <span key={word} className="block overflow-hidden pb-[0.08em]">
              <span data-word className="block">
                {word}
              </span>
            </span>
          ))}
        </p>
        <div className="mt-8 flex items-end justify-between gap-8">
          <div className="h-px flex-1 bg-line">
            <div data-bar className="h-full origin-left scale-x-0 bg-accent" />
          </div>
          <div className="overflow-hidden">
            <span data-count className="block font-mono text-[clamp(2rem,5vw,4.5rem)] leading-none tabular-nums">
              000
            </span>
          </div>
        </div>
      </div>
      <noscript>
        <style>{`.preloader{display:none!important}`}</style>
      </noscript>
    </div>
  );
}
