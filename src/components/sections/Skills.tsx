"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { skills } from "@/content/skills";
import { pick } from "@/content/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";

/** Category cards stick and stack; each one recedes as the next slides over it. */
export function Skills() {
  const t = useTranslations("skills");
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const scrollTrigger = { trigger: next, start: "top bottom", end: "top 20%", scrub: true };
          gsap.to(card, { scale: 0.9, ease: "none", scrollTrigger });
          gsap.to(card.querySelector("[data-card-shade]"), { opacity: 0.65, ease: "none", scrollTrigger });
        });
      });
      gsap.from("[data-skill]", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.04,
        duration: 1,
        scrollTrigger: { trigger: "[data-card]", start: "top 75%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" className="container-x relative py-[clamp(6rem,18vh,12rem)]">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionLabel index="05" className="lg:col-span-3 lg:pt-5">
          {t("label")}
        </SectionLabel>
        <SplitReveal
          as="h2"
          type="chars"
          className="display text-[clamp(2.5rem,7.5vw,8.5rem)] [overflow-wrap:anywhere] lg:col-span-9"
        >
          {t("title")}
        </SplitReveal>
      </div>

      <div className="mt-[clamp(4rem,10vh,7rem)] space-y-8 md:space-y-[6vh]">
        {skills.map((group, i) => (
          <article
            key={group.category.en}
            data-card
            className="origin-top overflow-hidden rounded-2xl border border-line bg-ink-2 p-6 md:sticky md:p-10 lg:p-14 theme-light:border-black/8 theme-light:bg-white theme-light:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.18)]"
            style={{ top: `calc(12vh + ${i * 1.75}rem)` }}
          >
            <div
              data-card-shade
              className="pointer-events-none absolute inset-0 z-10 bg-black opacity-0"
              aria-hidden="true"
            />
            <div className="flex items-start justify-between gap-6">
              <span className="label text-accent">
                {String(i + 1).padStart(2, "0")} / {String(skills.length).padStart(2, "0")}
              </span>
              <span className="label">{t("tools", { count: group.items.length })}</span>
            </div>
            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-5">
                <h3 className="display text-[clamp(2.5rem,5.5vw,6rem)]">{pick(group.category, locale)}</h3>
                <p className="mt-5 max-w-sm text-bone/60">{pick(group.blurb, locale)}</p>
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-4">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    data-skill
                    className="group flex items-center gap-3 rounded-xl border border-line bg-ink-3/50 p-3 transition-colors duration-500 hover:border-accent/60 theme-light:border-black/10 theme-light:bg-[#f3f2ef]"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white p-2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                      <Image src={item.icon} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
