"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap, useGSAP, whenMotion } from "@/lib/gsap";
import { getNextProject, getProject, projects } from "@/content/projects";
import { pick } from "@/content/types";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";

export function CaseStudy({ slug }: { slug: string }) {
  const t = useTranslations("case");
  const tWork = useTranslations("work");
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);
  const project = getProject(slug)!;
  const next = getNextProject(slug);
  const index = projects.indexOf(project);
  const pad = (n: number) => String(n).padStart(2, "0");

  const title = pick(project.title, locale);
  const category = pick(project.category, locale);
  const context = pick(project.context, locale);
  const description = pick(project.description, locale);
  const features = pick(project.features, locale);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(whenMotion(), () => {
        gsap.from("[data-case-intro] > *", {
          y: 28,
          autoAlpha: 0,
          stagger: 0.08,
          delay: 0.2,
          duration: 1,
          ease: "expo.out",
        });
        gsap.from("[data-case-media]", {
          y: 40,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-case-media]", start: "top 88%", once: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-feature]").forEach((row) => {
          gsap.from(row, {
            y: 24,
            autoAlpha: 0,
            scrollTrigger: { trigger: row, start: "top 92%", once: true },
          });
        });
        gsap.from("[data-tech]", {
          y: 16,
          autoAlpha: 0,
          stagger: 0.04,
          duration: 0.7,
          scrollTrigger: { trigger: "[data-tech-list]", start: "top 88%", once: true },
        });
        gsap.fromTo(
          "[data-next-img]",
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: "[data-next]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root, dependencies: [slug], revertOnUpdate: true },
  );

  return (
    <article ref={root}>
      <header className="container-x pb-10 pt-[max(7rem,18vh)]">
        <div className="flex items-center justify-between gap-6">
          <TransitionLink href="/#work" className="label link-underline text-bone">
            ← {t("back")}
          </TransitionLink>
          <span className="label tabular-nums text-mute">
            {pad(index + 1)} / {pad(projects.length)}
          </span>
        </div>

        <div data-case-intro className="mt-12 max-w-4xl">
          <p className="label text-accent">{category}</p>
          <h1 className="display mt-4 text-[clamp(2.75rem,8vw,6.5rem)] text-bone">{title}</h1>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
            <div className="flex min-w-[10rem] flex-col gap-1">
              <dt className="label">{t("context")}</dt>
              <dd className="text-bone/85">{context}</dd>
            </div>
            {project.year && (
              <div className="flex min-w-[8rem] flex-col gap-1">
                <dt className="label">{t("year")}</dt>
                <dd className="text-bone/85">{project.year}</dd>
              </div>
            )}
            <div className="flex min-w-[10rem] flex-col gap-1">
              <dt className="label">{t("stack")}</dt>
              <dd className="text-bone/85">{project.tech.slice(0, 3).join(" · ")}</dd>
            </div>
          </dl>

          <div className="mt-10">
            <p className="label mb-3 text-mute">{t("overview")}</p>
            <p className="text-[clamp(1.15rem,2.2vw,1.55rem)] leading-relaxed tracking-[-0.015em] text-bone/75">
              {description}
            </p>
          </div>
        </div>
      </header>

      <section className="container-x pb-[clamp(4rem,10vh,7rem)]" aria-labelledby="case-media-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="case-media-title" className="label text-bone">
            {t("watch")}
          </h2>
          <span className="label hidden text-mute sm:inline">{t("watchHint")}</span>
        </div>
        <div
          data-case-media
          className="relative aspect-video overflow-hidden border border-line bg-ink-2"
        >
          <video
            key={project.video}
            src={project.video}
            poster={project.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={t("watch")}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section
        className="container-x grid gap-8 border-t border-line py-[clamp(4rem,10vh,7rem)] lg:grid-cols-12"
        aria-labelledby="case-features-title"
      >
        <div className="lg:col-span-4">
          <h2 id="case-features-title" className="display text-[clamp(1.75rem,3.5vw,2.75rem)]">
            {t("features")}
          </h2>
          <p className="mt-3 max-w-sm text-bone/55">{t("featuresLead")}</p>
        </div>
        <ol className="lg:col-span-8">
          {features.map((feature, i) => (
            <li
              key={feature}
              data-feature
              className="grid grid-cols-[auto_1fr] items-baseline gap-5 border-t border-line py-5 text-[clamp(1.05rem,1.8vw,1.35rem)] leading-snug tracking-[-0.015em] text-bone/85 first:border-t-0 first:pt-0 last:pb-0"
            >
              <span className="label w-8 text-accent">{pad(i + 1)}</span>
              <span>{feature}</span>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="container-x border-t border-line py-[clamp(4rem,10vh,7rem)]"
        aria-labelledby="case-stack-title"
      >
        <h2 id="case-stack-title" className="label text-bone">
          {t("builtWith")}
        </h2>
        <ul data-tech-list className="mt-6 flex flex-wrap gap-2.5">
          {project.tech.map((tech) => (
            <li
              key={tech}
              data-tech
              className="border border-line px-4 py-2 text-sm tracking-[-0.01em] text-bone/80"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label={t("next")}>
        <TransitionLink
          href={`/work/${next.slug}`}
          data-next
          data-cursor={tWork("cursor")}
          className="group relative block overflow-hidden border-t border-line"
        >
          <div className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40">
            <Image
              data-next-img
              src={next.poster}
              alt=""
              fill
              sizes="100vw"
              className="scale-110 object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink" />
          </div>
          <div className="container-x relative flex flex-col justify-between gap-8 py-[clamp(4rem,12vh,8rem)] sm:flex-row sm:items-end">
            <div>
              <p className="label flex items-center gap-3 text-bone">
                {t("next")}
                <span className="text-accent transition-transform duration-500 group-hover:translate-x-2">
                  →
                </span>
              </p>
              <SplitReveal
                key={`next-${next.slug}`}
                as="p"
                type="chars"
                className="display mt-4 text-[clamp(2.5rem,8vw,7rem)]"
              >
                {pick(next.title, locale)}
              </SplitReveal>
              <p className="mt-3 text-bone/55">{pick(next.category, locale)}</p>
            </div>
            <span className="label text-mute">
              {pad(projects.indexOf(next) + 1)} / {pad(projects.length)}
            </span>
          </div>
        </TransitionLink>
      </nav>
    </article>
  );
}
