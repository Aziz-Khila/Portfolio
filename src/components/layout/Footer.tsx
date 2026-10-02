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
    <footer
      ref={ref}
      className="relative h-[85svh] min-h-[560px]"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="container-x fixed bottom-0 left-0 flex h-[85svh] min-h-[560px] w-full flex-col justify-between bg-ink-2 pb-6 pt-[clamp(4rem,11svh,6rem)]">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <p className="label mb-4">Menu</p>
            <ul className="space-y-1.5">
              {links.map((id) => (
                <li key={id}>
                  <TransitionLink href={`/#${id}`} className="link-underline text-bone/80 hover:text-bone">
                    {tNav(id)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-4">Social</p>
            <ul className="space-y-1.5">
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
          <div>
            <p className="label mb-4">{t("time")}</p>
            <LocalTime className="text-bone/80" />
            <p className="mt-1 text-bone/50">Tunis, TN</p>
          </div>
          <div className="md:text-right">
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="label link-underline text-bone"
            >
              {t("top")} ↑
            </button>
          </div>
        </div>

        <div>
          <p
            aria-label={site.lastName}
            className="display flex select-none overflow-hidden pt-[0.04em] text-[min(36vw,42svh)] leading-[0.8] tracking-[-0.06em]"
          >
            {site.lastName.split("").map((char, i) => (
              <span key={i} data-footer-char aria-hidden="true" className="inline-block">
                {char}
              </span>
            ))}
            <span data-footer-char aria-hidden="true" className="ml-[0.04em] inline-block text-[0.22em] leading-none text-accent">
              ©
            </span>
          </p>
          <div className="label mt-6 flex flex-col justify-between gap-2 border-t border-line pt-5 sm:flex-row">
            <span>
              © {new Date().getFullYear()} {site.name}. {t("rights")}
            </span>
            <span>{t("credit")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
