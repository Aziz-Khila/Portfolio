"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { education, experience } from "@/content/experience";
import { pick } from "@/content/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";

const startYear = (period: string) => period.split("–")[0].trim();

export function Path() {
  const t = useTranslations("path");
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const roll = root.current?.querySelector<HTMLElement>("[data-roll]");
      const entries = gsap.utils.toArray<HTMLElement>("[data-entry]");
      const reduced = prefersReducedMotion();

      entries.forEach((entry, i) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            entry.toggleAttribute("data-active", self.isActive);
            if (self.isActive && roll) {
              gsap.to(roll, {
                yPercent: (-100 / entries.length) * i,
                duration: reduced ? 0 : 1.1,
              });
            }
          },
        });

        if (reduced) return;
        gsap.from(entry.querySelector("[data-line]"), {
          scaleX: 0,
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: entry, start: "top 88%", once: true },
        });
        gsap.from(entry.querySelectorAll("[data-fade]"), {
          y: 40,
          autoAlpha: 0,
          stagger: 0.08,
          scrollTrigger: { trigger: entry, start: "top 82%", once: true },
        });
      });

      if (!reduced) {
        gsap.from("[data-edu]", {
          y: 40,
          autoAlpha: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-edu-list]", start: "top 85%", once: true },
        });
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} id="path" className="container-x relative py-[clamp(6rem,18vh,12rem)]">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionLabel index="03" className="lg:col-span-3 lg:pt-5">
          {t("label")}
        </SectionLabel>
        <div className="lg:col-span-9">
          <SplitReveal as="h2" type="chars" className="display text-[clamp(3rem,7.5vw,8.5rem)]">
            {t("title")}
          </SplitReveal>
          <p className="mt-6 max-w-lg text-lg text-bone/60">{t("lead")}</p>
        </div>
      </div>

      <div className="mt-[clamp(4rem,12vh,8rem)] grid gap-10 lg:grid-cols-12">
        <div className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-[30vh]">
            <div className="display h-[1em] overflow-hidden text-[clamp(4rem,9vw,10rem)] leading-none text-accent">
              <div data-roll>
                {experience.map((item) => (
                  <div key={item.period} className="h-[1em]">
                    {startYear(item.period)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ol className="lg:col-span-9">
          {experience.map((item) => (
            <li
              key={`${item.company}-${item.period}`}
              data-entry
              className="relative grid gap-6 py-10 transition-opacity duration-700 md:grid-cols-9 lg:opacity-35 lg:data-[active]:opacity-100"
            >
              <span data-line className="absolute inset-x-0 top-0 h-px origin-left bg-line" aria-hidden="true" />
              <div data-fade className="md:col-span-3">
                <p className="label text-bone">{item.period}</p>
                <p className="label mt-2 text-accent">{pick(item.type, locale)}</p>
              </div>
              <div className="md:col-span-6">
                <h3 data-fade className="text-[clamp(1.5rem,2.4vw,2.4rem)] font-medium leading-tight tracking-[-0.02em]">
                  {pick(item.title, locale)}
                </h3>
                <p data-fade className="mt-1 font-serif text-2xl italic text-bone/70">
                  {item.company}
                </p>
                <ul data-fade className="mt-6 space-y-2 text-bone/60">
                  {pick(item.points, locale).map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-[0.6em] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                <ul data-fade className="mt-6 flex flex-wrap gap-2">
                  {item.tech.map((tech) => (
                    <li key={tech} className="label rounded-full border border-line px-3 py-1.5">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-[clamp(4rem,12vh,8rem)] grid gap-10 lg:grid-cols-12">
        <h3 className="label lg:col-span-3">{t("education")}</h3>
        <ul data-edu-list className="lg:col-span-9">
          {education.map((item) => (
            <li
              key={item.period}
              data-edu
              className="grid gap-2 border-t border-line py-8 md:grid-cols-9 md:gap-6"
            >
              <span className="label text-bone md:col-span-3">{item.period}</span>
              <div className="md:col-span-6">
                <p className="text-[clamp(1.25rem,2vw,1.9rem)] font-medium tracking-[-0.02em]">
                  {pick(item.title, locale)}
                </p>
                <p className="mt-1 text-bone/60">{pick(item.school, locale)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
