"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scroll, scrollToTarget } from "@/lib/scroll";

type TransitionContextValue = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
});

export function useTransitionNavigate() {
  return useContext(TransitionContext).navigate;
}

function splitHref(href: string) {
  const [path, hash] = href.split("#");
  return { path: path || "/", hash: hash ? `#${hash}` : "" };
}

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      const { path, hash } = splitHref(href);

      if (path === pathname) {
        scrollToTarget(hash || 0);
        return;
      }
      if (busy.current) return;

      if (prefersReducedMotion() || !curtain.current) {
        pending.current = href;
        router.push(href, { scroll: false });
        return;
      }

      busy.current = true;
      pending.current = href;
      scroll.lenis?.stop();
      gsap
        .timeline()
        .set(curtain.current, { visibility: "visible" })
        .fromTo(
          curtain.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" },
        )
        .fromTo(
          curtain.current.querySelector("[data-curtain-label]"),
          { yPercent: 100 },
          { yPercent: 0, duration: 0.6 },
          "-=0.35",
        )
        .call(() => router.push(href, { scroll: false }));
    },
    [pathname, router],
  );

  useEffect(() => {
    const href = pending.current;
    if (!href) return;
    pending.current = null;
    const { hash } = splitHref(href);

    scroll.lenis?.resize();
    scrollToTarget(0, { immediate: true });
    ScrollTrigger.refresh();
    scroll.lenis?.start();

    // Pin spacers of the new page settle a frame later; jump to the anchor once they have.
    let frame = 0;
    if (hash) {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          scroll.lenis?.resize();
          scrollToTarget(hash, { immediate: true });
        });
      });
    }

    const cancel = () => cancelAnimationFrame(frame);
    if (!curtain.current) {
      busy.current = false;
      return cancel;
    }
    gsap
      .timeline({
        delay: 0.15,
        onComplete: () => {
          busy.current = false;
        },
      })
      .to(curtain.current.querySelector("[data-curtain-label]"), {
        yPercent: -100,
        duration: 0.5,
        ease: "expo.in",
      })
      .to(curtain.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        ease: "expo.inOut",
      })
      .set(curtain.current, { visibility: "hidden" });
    return cancel;
  }, [pathname]);

  return (
    <TransitionContext value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="invisible fixed inset-0 z-[80] grid place-items-center bg-accent text-ink"
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <div className="overflow-hidden">
          <p data-curtain-label className="display text-[clamp(2.5rem,8vw,7rem)]">
            Khila<sup className="text-[0.35em] align-super">©</sup>
          </p>
        </div>
      </div>
    </TransitionContext>
  );
}
