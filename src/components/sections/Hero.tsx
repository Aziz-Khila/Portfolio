"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, whenMotion } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import { site } from "@/content/site";
import { HeroGL, type HeroGLState } from "@/components/webgl/HeroGL";

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span key={i} data-char className="inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const root = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const [glState] = useState<HeroGLState>(() => ({ progress: 0 }));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(whenMotion(), () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=110%",
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .fromTo("[data-hero-video]", { scale: 1 }, { scale: 1.12, duration: 1 }, 0)
          .fromTo(glState, { progress: 0 }, { progress: 1, duration: 1 }, 0)
          .fromTo(
            "[data-hero-lockup]",
            { yPercent: 0, autoAlpha: 1 },
            { yPercent: -12, autoAlpha: 0, duration: 0.55, immediateRender: false },
            0,
          )
          // Explicit from-state so scrubbing back doesn't restore the pre-entrance opacity:0.
          .fromTo(
            "[data-hero-meta], [data-hero-scroll]",
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.25, immediateRender: false },
            0,
          );
          // Keep shade subtle — ramping it to 1 painted a flat void flash over the WebGL field.
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(whenMotion(), () => {
        const lockup = root.current?.querySelector<HTMLElement>("[data-hero-parallax]");
        const fine = window.matchMedia("(pointer: fine)").matches;
        const xTo =
          fine && lockup ? gsap.quickTo(lockup, "x", { duration: 0.9, ease: "power3.out" }) : null;
        const yTo =
          fine && lockup ? gsap.quickTo(lockup, "y", { duration: 0.9, ease: "power3.out" }) : null;

        const onMove = (e: PointerEvent) => {
          if (!xTo || !yTo) return;
          const nx = (e.clientX / window.innerWidth - 0.5) * 14;
          const ny = (e.clientY / window.innerHeight - 0.5) * 10;
          xTo(nx);
          yTo(ny);
        };

        if (fine) window.addEventListener("pointermove", onMove, { passive: true });

        gsap
          .timeline()
          .fromTo(
            "[data-hero-reveal]",
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
            0,
          )
          .fromTo(
            "[data-char]",
            { yPercent: 120 },
            { yPercent: 0, duration: 1.35, stagger: 0.022 },
            0.12,
          )
          .fromTo(
            "[data-hero-dot]",
            { scale: 0, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2)" },
            0.85,
          )
          .fromTo(
            "[data-hero-meta]",
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1 },
            0.55,
          )
          .fromTo("[data-hero-scroll]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.9);

        return () => {
          if (fine) window.removeEventListener("pointermove", onMove);
        };
      });
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative h-svh min-h-[min(560px,100svh)] overflow-hidden bg-[var(--hero-void)] text-[var(--hero-type)]"
    >
      <div data-hero-frame className="absolute inset-0">
        <div
          data-hero-reveal
          className="absolute inset-0 bg-[var(--hero-void)] bg-[radial-gradient(ellipse_at_50%_45%,rgb(255_90_31/0.25),transparent_58%)] [clip-path:inset(100%_0%_0%_0%)] motion-off:[clip-path:inset(0)]"
        >
          <div data-hero-video className="absolute inset-0 will-change-transform">
            <HeroGL state={glState} className="h-full w-full" />
          </div>
          <div
            data-hero-shade
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--hero-void)_55%,transparent)] via-transparent to-transparent opacity-40"
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        data-hero-parallax
        className="container-x pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-[4vh] pt-[max(5.5rem,10vh)] text-center will-change-transform"
      >
        <h1 className="sr-only">{site.name}</h1>

        <div data-hero-lockup className="flex flex-col items-center" aria-hidden="true">
          <p className="display-hero overflow-hidden whitespace-nowrap text-[clamp(2.4rem,12vw,9.5rem)] text-[var(--hero-type)]">
            <Chars text={site.firstName.toUpperCase()} />
          </p>
          <p className="display-hero inline-flex items-start justify-center overflow-hidden whitespace-nowrap text-[clamp(2.4rem,12vw,9.5rem)] text-[var(--hero-type)]">
            <Chars text={site.lastName.toUpperCase()} />
            <span
              data-hero-dot
              className="ml-[0.1em] mt-[0.2em] inline-block size-[0.12em] shrink-0 bg-accent motion-on:opacity-0"
            />
          </p>
        </div>

        <p data-hero-meta className="label mt-[clamp(1.35rem,3.5vh,2.25rem)] text-[color-mix(in_srgb,var(--hero-type)_70%,transparent)] motion-on:opacity-0">
          {t("credential")}
        </p>
      </div>

      <div
        data-hero-scroll
        className="container-x label absolute bottom-[6vh] left-0 flex w-full items-center justify-center gap-3 text-[color-mix(in_srgb,var(--hero-type)_55%,transparent)] motion-on:opacity-0"
        aria-hidden="true"
      >
        <span className="relative block h-8 w-px overflow-hidden bg-[color-mix(in_srgb,var(--hero-type)_20%,transparent)]">
          <span className="absolute inset-x-0 top-[25%] h-1/2 bg-[var(--hero-type)] motion-on:top-0 motion-on:animate-[scroll-line_1.8s_var(--ease-expo)_infinite]" />
        </span>
        {t("scroll")}
      </div>
    </section>
  );
}
