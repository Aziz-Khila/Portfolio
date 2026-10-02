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
        className="container-x fixed inset-x-0 top-0 z-50 flex items-center justify-between py-5 transition-transform duration-700 ease-[var(--ease-expo)] data-[hidden]:-translate-y-full"
        style={{ opacity: ready ? undefined : 0 }}
      >
        <div data-header-item>
          <TransitionLink
            href="/"
            aria-label={tA11y("home")}
            className="display flex items-baseline text-lg tracking-tight"
          >
            {site.lastName}
            <sup className="ml-0.5 text-[0.6em] text-accent">©</sup>
          </TransitionLink>
        </div>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((id) => (
              <li key={id} data-header-item>
                <TransitionLink href={`/#${id}`} className="label link-underline text-bone/80 hover:text-bone">
                  {t(id)}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-6">
          <div data-header-item className="hidden md:block">
            <MotionToggle />
          </div>
          <div data-header-item className="hidden sm:block">
            <LocaleSwitch />
          </div>
          <div data-header-item className="hidden lg:block">
            <Magnetic>
              <TransitionLink
                href="/#contact"
                className="label flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-bone transition-colors hover:border-accent hover:bg-accent hover:text-ink"
              >
                <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                {t("talk")}
              </TransitionLink>
            </Magnetic>
          </div>
          <button
            data-header-item
            type="button"
            className="label rounded-full border border-line px-4 py-2.5 text-bone lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t("close") : t("menu")}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="container-x fixed inset-0 z-40 flex flex-col justify-between bg-ink-2 pb-10 pt-28 lg:hidden"
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
                        className="display flex items-baseline gap-4 text-[clamp(3rem,14vw,6rem)]"
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
              className="flex items-end justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col gap-2">
                <MotionToggle />
                <LocaleSwitch />
              </div>
              <a href={`mailto:${site.email}`} className="label text-bone">
                {site.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
