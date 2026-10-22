"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { gsap, useGSAP, whenMotion } from "@/lib/gsap";
import { intro } from "@/lib/intro";
import { scroll } from "@/lib/scroll";
import { useMediaQuery } from "@/lib/use-media-query";
import { site } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";

const ease = [0.19, 1, 0.22, 1] as const;

function ResumeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("resume");
  const tA11y = useTranslations("a11y");
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    scroll.lenis?.stop();
    document.documentElement.dataset.cursorHide = "1";
    const previous = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.cursorHide;
      if (intro.isDone()) scroll.lenis?.start();
      previous?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-dialog-title"
          className="fixed inset-0 z-[70] flex items-end justify-center p-3 md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.2 } }}
          data-lenis-prevent
        >
          <button
            type="button"
            aria-label={tA11y("close")}
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-ink/80 backdrop-blur-md"
          />
          <motion.div
            className="relative flex h-[88svh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-line bg-ink-2"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.8, ease } }}
            exit={{ y: "100%", opacity: 0, transition: { duration: 0.5, ease } }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <p id="resume-dialog-title" className="label text-bone">
                {t("file")}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={site.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label rounded-full border border-line px-4 py-2 transition-colors hover:border-bone"
                >
                  {t("openTab")} ↗
                </a>
                <button
                  ref={closeButton}
                  type="button"
                  onClick={onClose}
                  className="label rounded-full bg-bone px-4 py-2 text-ink transition-colors hover:bg-accent"
                >
                  {tA11y("close")}
                </button>
              </div>
            </div>
            <iframe title={t("file")} src={`${site.cv}#view=FitH`} className="h-full w-full flex-1 bg-white" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Resume() {
  const t = useTranslations("resume");
  const tHero = useTranslations("hero");
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const coarse = useMediaQuery("(pointer: coarse)");

  const openResume = () => {
    if (coarse) {
      window.open(site.cv, "_blank", "noopener,noreferrer");
      return;
    }
    setOpen(true);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(whenMotion(), () => {
        const doc = root.current?.querySelector<HTMLElement>("[data-doc]");
        const stage = root.current?.querySelector<HTMLElement>("[data-doc-stage]");
        if (!doc || !stage) return;
        gsap.fromTo(
          "[data-doc-scroll]",
          { rotationX: 28, rotationZ: -8, y: 120 },
          {
            rotationX: 0,
            rotationZ: -3,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: 1 },
          },
        );

        if (!window.matchMedia("(pointer: fine)").matches) return;
        // rotationX/Y (not CSS rotate*) so quickTo.resetTo can track them.
        gsap.set(doc, { rotationX: 0, rotationY: 0, transformPerspective: 1200 });
        const tiltY = gsap.quickTo(doc, "rotationY", { duration: 0.8, ease: "power3" });
        const tiltX = gsap.quickTo(doc, "rotationX", { duration: 0.8, ease: "power3" });
        const move = (e: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          tiltY(((e.clientX - rect.left) / rect.width - 0.5) * 18);
          tiltX(-((e.clientY - rect.top) / rect.height - 0.5) * 14);
        };
        const leave = () => {
          tiltY(0);
          tiltX(0);
        };
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", leave);
        return () => {
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="resume"
      className="container-x relative overflow-hidden border-t border-line py-[clamp(6rem,18vh,12rem)]"
    >
      <div className="grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionLabel index="06">{t("label")}</SectionLabel>
          <SplitReveal as="h2" type="words" className="display mt-10 text-[clamp(2.75rem,6vw,6.5rem)]">
            {t("title")}
          </SplitReveal>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/60">{t("text")}</p>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Magnetic>
              <button
                type="button"
                onClick={openResume}
                aria-haspopup={coarse ? undefined : "dialog"}
                className="grid size-36 place-items-center rounded-full bg-accent p-4 text-center font-medium text-ink transition-transform duration-500 hover:scale-105"
              >
                {t("view")}
              </button>
            </Magnetic>
            <a href={site.cv} download className="label link-underline text-bone">
              {t("download")} ↓
            </a>
          </div>
        </div>

        <div data-doc-stage className="relative lg:col-span-5 lg:col-start-8 [perspective:1400px]">
          <div data-doc-scroll className="[transform-style:preserve-3d]">
            <button
              type="button"
              data-doc
              data-cursor={t("view")}
              onClick={openResume}
              aria-label={t("view")}
              className="relative mx-auto block aspect-[1/1.414] w-full max-w-md rounded-lg border border-black/5 bg-[#efece6] p-8 text-left text-[#0a0a0b] shadow-[0_50px_100px_-35px_rgba(0,0,0,0.65)] [transform-style:preserve-3d] theme-light:border-black/10 theme-light:bg-white theme-light:shadow-[0_28px_60px_-28px_rgba(0,0,0,0.2)]"
            >
              <span
                className="absolute -right-3 -top-3 -z-10 h-full w-full rounded-lg bg-[#1c1c1f] [transform:translateZ(-40px)] theme-light:bg-[#ddd9d2]"
                aria-hidden="true"
              />
              <span className="flex items-start justify-between">
                <span>
                  <span className="display block text-3xl">{site.name}</span>
                  <span className="mt-1 block font-serif text-lg italic text-[#0a0a0b]/55">{tHero("role")}</span>
                </span>
                <span className="rounded bg-accent px-2 py-1 font-mono text-[0.65rem] text-[#0a0a0b]">PDF</span>
              </span>
              <span className="mt-8 block h-px bg-[#0a0a0b]/12" />
              {[
                [100, 92, 60],
                [100, 84, 96, 48],
                [76, 52],
              ].map((lines, block) => (
                <span key={block} className="mt-7 block space-y-2.5">
                  <span className="block h-2 w-20 rounded bg-[#0a0a0b]/65" />
                  {lines.map((width, i) => (
                    <span key={i} className="block h-1.5 rounded bg-[#0a0a0b]/12" style={{ width: `${width}%` }} />
                  ))}
                </span>
              ))}
              <span className="absolute inset-x-8 bottom-8 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-wider text-[#0a0a0b]/45">
                <span>{site.email}</span>
                <span>2026</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <ResumeModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
