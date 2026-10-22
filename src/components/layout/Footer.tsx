"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/content/site";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LocalTime } from "./LocalTime";

const links = ["work", "about", "path", "skills", "contact"] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-footer-char]", {
        yPercent: 100,
        stagger: 0.04,
        duration: 1.4,
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative">
      <div className="container-x relative flex w-full flex-col bg-ink-2 pb-5 pt-[clamp(2.5rem,6svh,3.5rem)]">
        <div className="grid grid-cols-2 items-center gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-2">
            <p className="label mb-3">Menu</p>
            <ul className="space-y-1">
              {links.map((id) => (
                <li key={id}>
                  <TransitionLink href={`/#${id}`} className="link-underline text-bone/80 hover:text-bone">
                    {tNav(id)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="label mb-3">Social</p>
            <ul className="space-y-1">
              <li>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline text-bone/80 hover:text-bone">
                  LinkedIn
                </a>
              </li>
              {site.github && (
                <li>
                  <a href={site.github} target="_blank" rel="noopener noreferrer" className="link-underline text-bone/80 hover:text-bone">
                    GitHub
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${site.email}`} className="link-underline text-bone/80 hover:text-bone">
                  Email
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="label mb-3">{t("time")}</p>
            <LocalTime className="text-bone/80" />
            <p className="mt-1 text-bone/50">Tunis, TN</p>
          </div>

          <div className="col-span-2 flex flex-col items-end justify-center gap-4 md:col-span-5">
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="label link-underline text-bone"
            >
              {t("top")} ↑
            </button>
            <p
              aria-label={site.lastName}
              className="display flex select-none justify-end overflow-hidden pt-[0.18em] pr-[0.2em] text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.9] tracking-[-0.04em]"
            >
              {site.lastName.split("").map((char, i) => (
                <span key={i} data-footer-char aria-hidden="true" className="inline-block">
                  {char}
                </span>
              ))}
              <span
                data-footer-char
                aria-hidden="true"
                className="ml-[0.08em] inline-block shrink-0 text-[0.35em] leading-none text-accent"
              >
                ©
              </span>
            </p>
          </div>
        </div>

        <div className="label mt-8 flex flex-col justify-between gap-2 border-t border-line pt-4 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {site.name}. {t("rights")}
          </span>
          <span>{t("credit")}</span>
        </div>
      </div>
    </footer>
  );
}
