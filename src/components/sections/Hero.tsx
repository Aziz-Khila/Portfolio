"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, prefersReducedMotion, useGSAP, whenMotion } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import { site } from "@/content/site";
import { HeroGL, type HeroGLState } from "@/components/webgl/HeroGL";

const FRAME_FALLBACK = "inset(36% 36% 36% 36% round 14px)";
const FRAME_FULL = "inset(0px 0px 0px 0px round 0px)";

/** Clip the full-screen frame down to a centred box inside the empty slot between the name lines. */
function frameStart(section: HTMLElement | null) {
  const slot = section?.querySelector<HTMLElement>("[data-hero-slot]");
  if (!section || !slot) return FRAME_FALLBACK;
  const box = section.getBoundingClientRect();
  const area = slot.getBoundingClientRect();
  const mobile = window.innerWidth < 768;
  const ratio = mobile ? 0.85 : 1.45;

  let width = mobile ? area.width : Math.min(area.width, window.innerWidth * 0.3);
  let height = width / ratio;
  if (height > area.height) {
    height = area.height;
    width = height * ratio;
  }
  const left = area.left - box.left + (area.width - width) / 2;
  const top = area.top - box.top + (area.height - height) / 2;
  const right = box.width - left - width;
  const bottom = box.height - top - height;
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${mobile ? 10 : 14}px)`;
}

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
      const section = root.current;
      const frame = section?.querySelector("[data-hero-frame]");
      if (!section || !frame) return;
      const place = () => gsap.set(frame, { clipPath: frameStart(section) });
      place();
      // With motion on, the scroll timeline re-measures on refresh instead.
      if (!prefersReducedMotion()) return;
      const observer = new ResizeObserver(place);
      observer.observe(section.querySelector("[data-hero-slot]") ?? section);
      return () => observer.disconnect();
    },
    { scope: root },
  );

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
              end: "+=130%",
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            "[data-hero-frame]",
            { clipPath: () => frameStart(root.current) },
            { clipPath: FRAME_FULL, duration: 1 },
            0,
          )
          .fromTo("[data-hero-video]", { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
          .fromTo(glState, { progress: 0 }, { progress: 1, duration: 1 }, 0)
          .to("[data-hero-line='1']", { xPercent: -30, autoAlpha: 0, duration: 0.7 }, 0)
          .to("[data-hero-line='2']", { xPercent: 30, autoAlpha: 0, duration: 0.7 }, 0)
          .to("[data-hero-meta], [data-hero-scroll]", { autoAlpha: 0, duration: 0.25 }, 0)
          .fromTo("[data-hero-shade]", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.55)
          .fromTo(
            "[data-hero-tagline] [data-word]",
            { yPercent: 115 },
            { yPercent: 0, duration: 0.3, stagger: 0.03 },
            0.65,
          );
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(whenMotion(), () => {
        gsap
          .timeline()
          .fromTo("[data-char]", { yPercent: 120 }, { yPercent: 0, duration: 1.5, stagger: 0.035 }, 0)
          .fromTo(
            "[data-hero-reveal]",
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
            0,
          )
          .fromTo(
            "[data-hero-meta] > *",
            { yPercent: 100, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, stagger: 0.08 },
            0.5,
          )
          .fromTo("[data-hero-scroll]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.9);
      });
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} id="top" className="relative h-svh min-h-[560px] overflow-hidden">
      <div
        data-hero-frame
        className="absolute inset-0 will-change-[clip-path]"
        style={{ clipPath: FRAME_FALLBACK }}
      >
        <div
          data-hero-reveal
          className="absolute inset-0 bg-ink bg-[radial-gradient(ellipse_at_60%_45%,rgb(255_90_31/0.35),transparent_60%)]"
        >
          <div data-hero-video className="absolute inset-0">
            <HeroGL state={glState} className="h-full w-full" />
          </div>
          <div
            data-hero-shade
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-0"
          />
        </div>
        <p
          data-hero-tagline
          className="container-x display absolute inset-x-0 bottom-[12vh] hidden max-w-[16ch] text-[clamp(2.5rem,6.5vw,7rem)] motion-on:block lg:max-w-[18ch]"
        >
          {t("tagline")
            .split(" ")
            .map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span data-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
        </p>
      </div>

      <div className="container-x pointer-events-none absolute inset-0 flex flex-col pb-[5vh] pt-[max(5.5rem,12vh)]">
        <h1 className="sr-only">{site.name}</h1>
        <p
          data-hero-line="1"
          aria-hidden="true"
          className="display block self-start overflow-hidden pb-[0.06em] text-[min(12.6vw,14svh)] lg:text-[min(10.6vw,18svh)]"
        >
          <Chars text={site.firstName} />
        </p>

        <div className="flex min-h-0 flex-1 flex-col gap-6 py-[3vh] md:flex-row md:gap-8">
          <div className="flex justify-between gap-6 md:contents">
            <div data-hero-meta className="label md:order-1 md:w-1/5">
              <span className="block leading-relaxed">
                {t("role")}
                <br />
                {t("location")}
              </span>
            </div>
            <div data-hero-meta className="label md:order-3 md:flex md:w-1/5 md:justify-end">
              <span className="flex h-fit items-center gap-2 text-bone">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                {t("available")}
              </span>
            </div>
          </div>
          <div data-hero-slot className="min-h-0 flex-1 md:order-2" />
        </div>

        <p
          data-hero-line="2"
          aria-hidden="true"
          className="display block self-end overflow-hidden pb-[0.06em] text-[min(12.6vw,14svh)] lg:text-[min(10.6vw,18svh)]"
        >
          <Chars text={site.lastName} />
          <sup className="ml-1 inline-block align-top text-[0.22em] text-accent">
            <span data-char className="inline-block">
              ©
            </span>
          </sup>
        </p>
      </div>

      <div
        data-hero-scroll
        className="container-x label absolute bottom-[7vh] left-0 hidden items-center gap-3 md:flex"
        aria-hidden="true"
      >
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-line_1.8s_var(--ease-expo)_infinite] bg-bone" />
        </span>
        {t("scroll")}
      </div>
    </section>
  );
}
