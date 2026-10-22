"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, SplitText, useGSAP, whenMotion } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import { site } from "@/content/site";
import { Counter } from "@/components/ui/Counter";
import { SectionLabel } from "@/components/ui/SectionLabel";

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
            scrollTrigger: { trigger: "[data-band]", start: "top 82%", once: true },
          },
        );
        gsap.fromTo(
          "[data-portrait-img]",
          { yPercent: -5, scale: 1.14 },
          {
            yPercent: 5,
            scale: 1.04,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-portrait]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          "[data-about-stats]",
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: "[data-band]", start: "top 75%", once: true },
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
      <SectionLabel index="01">{t("label")}</SectionLabel>

      <div
        data-band
        className="mt-10 grid items-start gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-14"
      >
        <figure className="mx-auto w-full max-w-md lg:col-span-5 lg:mx-0 lg:max-w-none">
          <div
            data-portrait
            className="relative aspect-[3/4] overflow-hidden bg-ink-2"
          >
            <Image
              data-portrait-img
              src={site.photo}
              alt={site.name}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 28rem, 100vw"
              className="object-cover object-center"
            />
          </div>
          <figcaption className="label mt-5 text-bone/70">
            {site.name}
            <span className="mx-2 text-accent" aria-hidden="true">
              ·
            </span>
            Tunis
          </figcaption>
        </figure>

        <div className="flex flex-col gap-10 lg:col-span-7 lg:self-stretch">
          <div className="flex flex-1 flex-col justify-center">
            <p
              data-statement
              className="text-[clamp(1.9rem,3.8vw,3.85rem)] font-medium leading-[1.08] tracking-[-0.035em] [&_em]:text-accent"
            >
              {t.rich("statement", { em: (chunks) => <em>{chunks}</em> })}
            </p>
          </div>

          <dl
            data-about-stats
            className="mt-auto grid grid-cols-3 gap-4 border-t border-line pt-8 motion-on:opacity-0"
          >
            {statKeys.map((key) => (
              <div key={key} className="flex flex-col-reverse gap-2 self-start">
                <dt className="label">{t(`stats.${key}`)}</dt>
                <dd className="display text-[clamp(2.5rem,5vw,4.75rem)] leading-none">
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
