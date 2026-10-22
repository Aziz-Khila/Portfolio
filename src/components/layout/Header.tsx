"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { intro, useIntroDone } from "@/lib/intro";
import { scroll } from "@/lib/scroll";
import { site } from "@/content/site";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { LocaleSwitch } from "./LocaleSwitch";
import { MotionToggle } from "./MotionToggle";
import { ThemeToggle } from "./ThemeToggle";

const links = ["work", "about", "path", "skills", "contact"] as const;

export function Header() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const ref = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (!ready) return;
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          "[data-header-item]",
          { yPercent: -120, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.05, delay: 0.5 },
        );
      }
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const hide = self.direction === 1 && self.scroll() > 160;
          ref.current?.toggleAttribute("data-hidden", hide);
        },
      });
    },
    { scope: ref, dependencies: [ready] },
  );

  useEffect(() => {
    if (open) scroll.lenis?.stop();
    else if (intro.isDone()) scroll.lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        ref={ref}
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[transform,background-color,border-color,backdrop-filter] duration-700 ease-[var(--ease-expo)] data-[hidden]:-translate-y-full supports-[backdrop-filter]:bg-ink/55 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:border-line/60"
        style={{ opacity: ready ? undefined : 0 }}
      >
        <div className="container-x flex items-center justify-between gap-4 py-4 md:py-5">
          <div data-header-item className="min-w-0 shrink-0">
            <TransitionLink
              href="/"
              aria-label={tA11y("home")}
              className="display flex items-baseline text-lg tracking-tight text-bone"
            >
              {site.lastName}
              <sup className="ml-0.5 inline-block text-[0.6em] leading-none text-accent">©</sup>
            </TransitionLink>
          </div>

          <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 xl:block">
            <ul className="flex items-center gap-7 xl:gap-8">
              {links.map((id) => (
                <li key={id} data-header-item>
                  <TransitionLink
                    href={`/#${id}`}
                    className="label link-underline text-bone/75 hover:text-bone"
                  >
                    {t(id)}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            <div
              data-header-item
              className="flex items-center gap-1 rounded-full border border-line/80 bg-ink-2/50 px-2 sm:gap-2 sm:px-3"
            >
              <ThemeToggle />
              <span className="hidden h-3 w-px bg-line sm:block" aria-hidden="true" />
              <div className="hidden md:block">
                <MotionToggle />
              </div>
              <span className="hidden h-3 w-px bg-line md:block" aria-hidden="true" />
              <div className="hidden sm:block">
                <LocaleSwitch />
              </div>
            </div>

            <div data-header-item className="hidden xl:block">
              <Magnetic>
                <TransitionLink
                  href="/#contact"
                  className="label flex items-center gap-2 rounded-full border border-line bg-ink-2/40 px-4 py-2.5 text-bone transition-colors hover:border-accent hover:bg-accent hover:text-ink"
                >
                  <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {t("talk")}
                </TransitionLink>
              </Magnetic>
            </div>

            <button
              data-header-item
              type="button"
              className="label rounded-full border border-line bg-ink-2/40 px-4 py-2.5 text-bone xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? t("close") : t("menu")}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            className="container-x fixed inset-0 z-40 flex flex-col justify-between gap-8 overflow-y-auto overscroll-contain bg-ink-2 pb-10 pt-28 xl:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-2">
                {links.map((id, i) => (
                  <li key={id} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <TransitionLink
                        href={`/#${id}`}
                        onClick={() => setOpen(false)}
                        className="display flex items-baseline gap-4 text-[clamp(2.5rem,min(14vw,12svh),6rem)]"
                      >
                        <span className="label text-accent">0{i + 1}</span>
                        {t(id)}
                      </TransitionLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="flex shrink-0 flex-wrap items-end justify-between gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col gap-1 rounded-2xl border border-line bg-ink/40 px-4 py-3">
                <ThemeToggle />
                <MotionToggle />
                <LocaleSwitch />
              </div>
              <a href={`mailto:${site.email}`} className="label break-all text-bone">
                {site.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
