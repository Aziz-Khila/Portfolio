"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, SplitText, useGSAP, whenMotion } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import { site } from "@/content/site";
import { Counter } from "@/components/ui/Counter";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";

const statKeys = ["projects", "years", "clients"] as const;

export function About() {
  const t = useTranslations("about");
  const root = useRef<HTMLElement>(null);
  const ready = useIntroDone();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(whenMotion(), () => {
        const split = SplitText.create("[data-statement]", {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.14 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: {
                  trigger: "[data-statement]",
                  start: "top 78%",
                  end: "bottom 45%",
                  scrub: true,
                },
              },
            );
          },
        });

        gsap.fromTo(
          "[data-portrait]",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: "[data-portrait]", start: "top 80%", once: true },
          },
        );
        gsap.fromTo(
          "[data-portrait-img]",
          { yPercent: -6, scale: 1.18 },
          {
            yPercent: 6,
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-portrait]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        return () => split.revert();
      });
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="about"
      className="container-x relative scroll-mt-0 py-[clamp(6rem,18vh,12rem)]"
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionLabel index="01" className="lg:col-span-3 lg:pt-5">
          {t("label")}
        </SectionLabel>
        <p
          data-statement
          className="text-[clamp(1.9rem,4.3vw,4.6rem)] font-medium leading-[1.05] tracking-[-0.035em] lg:col-span-9 [&_em]:text-accent"
        >
          {t.rich("statement", { em: (chunks) => <em>{chunks}</em> })}
        </p>
      </div>

      <div className="mt-[clamp(5rem,14vh,10rem)] grid items-end gap-12 lg:grid-cols-12">
        <figure
          data-portrait
          className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-ink-2 lg:col-span-4 lg:col-start-2"
        >
          <Image
            data-portrait-img
            src={site.photo}
            alt={site.name}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover object-[50%_25%]"
          />
          <figcaption className="label absolute bottom-4 left-4 text-bone/80">
            {site.name} — Tunis
          </figcaption>
        </figure>

        <div className="lg:col-span-5 lg:col-start-7">
          <SplitReveal as="p" className="max-w-xl text-lg leading-relaxed text-bone/70 md:text-xl">
            {t("body")}
          </SplitReveal>
          <dl className="mt-14 grid grid-cols-3 border-t border-line">
            {statKeys.map((key) => (
              <div key={key} className="flex flex-col-reverse gap-3 pr-4 pt-6">
                <dt className="label">{t(`stats.${key}`)}</dt>
                <dd className="display text-[clamp(3rem,6.5vw,6.5rem)]">
                  <Counter value={site.stats[key]} />
                  <span className="text-accent">+</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
