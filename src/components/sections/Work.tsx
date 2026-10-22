"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap, useGSAP, whenMotion } from "@/lib/gsap";
import { useMotionMode } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { workRegistry } from "@/lib/work-registry";
import { projects, type Project } from "@/content/projects";
import { pick } from "@/content/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";

const WorkGL = dynamic(() => import("@/components/webgl/WorkGL"), { ssr: false });

const DESKTOP = "(min-width: 1024px)";
const GL_CAPABLE = "(min-width: 1024px) and (pointer: fine)";

function WorkCard({ project, index }: { project: Project; index: number }) {
  const t = useTranslations("work");
  const locale = useLocale();
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!media.current || !video.current) return;
    workRegistry.set(project.slug, {
      el: media.current,
      video: video.current,
      hover: false,
      mouse: { x: 0.5, y: 0.5 },
    });
    return () => {
      workRegistry.delete(project.slug);
    };
  }, [project.slug]);

  const setHover = (hover: boolean) => {
    const entry = workRegistry.get(project.slug);
    if (entry) entry.hover = hover;
    if (hover) video.current?.play().catch(() => {});
    else video.current?.pause();
  };

  const trackPointer = (event: PointerEvent) => {
    const entry = workRegistry.get(project.slug);
    if (!entry || !media.current) return;
    const rect = media.current.getBoundingClientRect();
    entry.mouse = {
      x: (event.clientX - rect.left) / rect.width,
      y: 1 - (event.clientY - rect.top) / rect.height,
    };
  };

  const title = pick(project.title, locale);

  return (
    <article className="w-full shrink-0 motion-off:max-w-5xl motion-on:lg:w-[min(50vw,60rem)]">
      <TransitionLink
        href={`/work/${project.slug}`}
        data-cursor={t("cursor")}
        aria-label={`${t("view")}: ${title}`}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onPointerMove={trackPointer}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="group block"
      >
        <div
          ref={media}
          data-media
          className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-ink-2"
        >
          <Image
            src={project.poster}
            alt=""
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03] motion-on:fine-hover:brightness-[0.5] motion-on:fine-hover:contrast-110 motion-on:fine-hover:grayscale motion-on:fine-hover:group-hover:brightness-100 motion-on:fine-hover:group-hover:contrast-100 motion-on:fine-hover:group-hover:grayscale-0"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/45 opacity-0 transition-opacity duration-700 motion-on:fine-hover:opacity-100 motion-on:fine-hover:group-hover:opacity-0"
          />
          <video
            ref={video}
            src={project.video}
            poster={project.poster}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>
        <div className="mt-6 grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-t border-line pt-5 md:grid-cols-[auto_1fr_auto]">
          <span className="label text-accent">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="display text-[clamp(2rem,3.4vw,3.6rem)] transition-colors group-hover:text-accent">
              {title}
            </h3>
            <p className="mt-2 text-bone/60">
              {pick(project.category, locale)} — {pick(project.context, locale)}
            </p>
          </div>
          <span className="label hidden max-w-[14rem] text-right md:block">
            {project.tech.slice(0, 3).join(" / ")}
          </span>
        </div>
      </TransitionLink>
    </article>
  );
}

export function Work() {
  const t = useTranslations("work");
  const root = useRef<HTMLElement>(null);
  const glDevice = useMediaQuery(GL_CAPABLE);
  const glCapable = useMotionMode() === "full" && glDevice;
  const [glReady, setGlReady] = useState(false);
  const handleReady = useCallback(() => setGlReady(true), []);
  const total = String(projects.length).padStart(2, "0");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(whenMotion(DESKTOP), () => {
        const track = root.current?.querySelector<HTMLElement>("[data-track]");
        const bar = root.current?.querySelector<HTMLElement>("[data-progress]");
        const counter = root.current?.querySelector<HTMLElement>("[data-counter]");
        if (!track) return;
        const distance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
              if (counter) {
                const current = Math.min(projects.length, Math.floor(self.progress * projects.length) + 1);
                counter.textContent = String(current).padStart(2, "0");
              }
            },
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="work"
      aria-labelledby="work-title"
      data-gl={glCapable && glReady ? "on" : "off"}
      className="relative"
    >
      <div data-pin className="relative py-[clamp(6rem,14vh,10rem)] motion-on:lg:flex motion-on:lg:h-svh motion-on:lg:items-center motion-on:lg:overflow-hidden motion-on:lg:py-0">
        <div
          data-track
          className="container-x flex flex-col gap-24 will-change-transform motion-off:items-center motion-on:lg:flex-row motion-on:lg:items-end motion-on:lg:gap-[6vw] motion-on:lg:pr-[12vw]"
        >
          <header className="flex shrink-0 flex-col justify-between gap-10 motion-off:items-center motion-off:text-center motion-on:lg:h-[min(31vw,37rem)] motion-on:lg:w-[34vw]">
            <SectionLabel index="02">{t("label")}</SectionLabel>
            <div className="motion-off:flex motion-off:flex-col motion-off:items-center">
              <SplitReveal
                as="h2"
                id="work-title"
                type="chars"
                className="display text-[clamp(2.5rem,8vw,9rem)] [overflow-wrap:anywhere]"
              >
                {t("title")}
              </SplitReveal>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/60">{t("intro")}</p>
              <p className="label mt-10 hidden items-center gap-3 motion-on:lg:flex">
                {t("hint")}
                <span aria-hidden="true" className="text-accent">
                  →
                </span>
              </p>
            </div>
          </header>
          {projects.map((project, index) => (
            <WorkCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        <div
          aria-hidden="true"
          className="container-x absolute inset-x-0 bottom-8 hidden items-center gap-6 motion-on:lg:flex"
        >
          <span className="label tabular-nums text-bone">
            <span data-counter>01</span> / {total}
          </span>
          <span className="h-px flex-1 bg-line">
            <span data-progress className="block h-full origin-left scale-x-0 bg-accent" />
          </span>
        </div>
      </div>

      {glCapable && <WorkGL section={root} onReady={handleReady} />}
    </section>
  );
}
