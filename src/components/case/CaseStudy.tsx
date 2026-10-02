"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap, useGSAP, whenMotion } from "@/lib/gsap";
import { getNextProject, getProject, projects } from "@/content/projects";
import { pick } from "@/content/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(whenMotion(), () => {
        gsap.fromTo(
          "[data-case-media]",
          { clipPath: "inset(12% 10% 12% 10% round 24px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 6px)",
            ease: "none",
            scrollTrigger: {
              trigger: "[data-case-media]",
              start: "top bottom",
              end: "center center",
              scrub: true,
            },
          },
        );
        gsap.from("[data-case-meta] > *", { y: 30, autoAlpha: 0, stagger: 0.08, delay: 0.6 });
        gsap.utils.toArray<HTMLElement>("[data-feature]").forEach((row) => {
          gsap.from(row, {
            y: 40,
            autoAlpha: 0,
            scrollTrigger: { trigger: row, start: "top 90%", once: true },
          });
        });
        gsap.from("[data-tech]", {
          scale: 0.6,
          autoAlpha: 0,
          stagger: 0.05,
          ease: "back.out(2)",
          duration: 0.8,
          scrollTrigger: { trigger: "[data-tech-list]", start: "top 85%", once: true },
        });
        gsap.fromTo(
          "[data-next-img]",
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: { trigger: "[data-next]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root, dependencies: [slug], revertOnUpdate: true },
  );

  const title = pick(project.title, locale);

  return (
    <article ref={root}>
      <header className="container-x pb-[8vh] pt-[22vh]">
        <div className="flex items-center justify-between">
          <TransitionLink href="/#work" className="label link-underline text-bone">
            ← {t("back")}
          </TransitionLink>
          <span className="label tabular-nums">
            {pad(index + 1)} / {pad(projects.length)}
          </span>
        </div>
        <SplitReveal
          key={`title-${slug}`}
          as="h1"
          type="chars"
          delay={0.25}
          className="display mt-12 text-[clamp(3.5rem,12.5vw,14rem)]"
        >
          {title}
        </SplitReveal>
        <dl data-case-meta className="mt-12 grid gap-8 border-t border-line pt-6 sm:grid-cols-3">
          <div>
            <dt className="label">{t("category")}</dt>
            <dd className="mt-2 text-lg">{pick(project.category, locale)}</dd>
          </div>
          <div>
            <dt className="label">{t("context")}</dt>
            <dd className="mt-2 text-lg">{pick(project.context, locale)}</dd>
          </div>
          {project.year && (
            <div>
              <dt className="label">{t("year")}</dt>
              <dd className="mt-2 text-lg">{project.year}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="px-[clamp(0.75rem,2vw,2rem)]">
        <div data-case-media className="relative aspect-video overflow-hidden rounded-md bg-ink-2">
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
      </div>

      <section className="container-x grid gap-10 py-[clamp(6rem,16vh,11rem)] lg:grid-cols-12">
        <SectionLabel index="01" className="lg:col-span-3 lg:pt-3">
          {t("overview")}
        </SectionLabel>
        <SplitReveal
          key={`desc-${slug}`}
          as="p"
          className="text-[clamp(1.6rem,3.1vw,3.2rem)] font-medium leading-[1.15] tracking-[-0.025em] lg:col-span-9"
        >
          {pick(project.description, locale)}
        </SplitReveal>
      </section>

      <section className="container-x grid gap-10 pb-[clamp(6rem,16vh,11rem)] lg:grid-cols-12">
        <SectionLabel index="02" className="lg:col-span-3 lg:pt-7">
          {t("features")}
        </SectionLabel>
        <ol className="lg:col-span-9">
          {pick(project.features, locale).map((feature, i) => (
            <li
              key={feature}
              data-feature
              className="grid grid-cols-[3.5rem_1fr] items-baseline border-t border-line py-7 text-[clamp(1.25rem,2.2vw,2rem)] tracking-[-0.02em] last:border-b"
            >
              <span className="label text-accent">{pad(i + 1)}</span>
              {feature}
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x grid gap-10 pb-[clamp(6rem,16vh,11rem)] lg:grid-cols-12">
        <SectionLabel index="03" className="lg:col-span-3 lg:pt-4">
          {t("stack")}
        </SectionLabel>
        <ul data-tech-list className="flex flex-wrap gap-3 lg:col-span-9">
          {project.tech.map((tech) => (
            <li
              key={tech}
              data-tech
              className="rounded-full border border-line px-6 py-3 text-[clamp(1rem,1.6vw,1.4rem)] transition-colors hover:border-accent hover:text-accent"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      <TransitionLink
        href={`/work/${next.slug}`}
        data-next
        data-cursor={tWork("cursor")}
        className="group relative block overflow-hidden border-t border-line"
      >
        <div className="absolute inset-0 opacity-25 transition-opacity duration-700 group-hover:opacity-50">
          <Image
            data-next-img
            src={next.poster}
            alt=""
            fill
            sizes="100vw"
            className="scale-125 object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink" />
        </div>
        <div className="container-x relative py-[clamp(6rem,20vh,14rem)]">
          <p className="label flex items-center gap-3 text-bone">
            {t("next")}
            <span className="text-accent transition-transform duration-500 group-hover:translate-x-2">→</span>
          </p>
          <p className="display mt-6 text-[clamp(3.5rem,12vw,13rem)] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-4">
            {pick(next.title, locale)}
          </p>
          <p className="mt-4 text-bone/60">{pick(next.category, locale)}</p>
        </div>
      </TransitionLink>
    </article>
  );
}
