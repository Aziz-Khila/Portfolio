import type Lenis from "lenis";

export const scroll: { lenis: Lenis | null } = { lenis: null };

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function scrollToTarget(
  target: string | number | HTMLElement,
  { immediate = false }: { immediate?: boolean } = {},
) {
  if (scroll.lenis) {
    scroll.lenis.scrollTo(target, {
      immediate,
      force: true,
      duration: 1.6,
      easing: easeOutQuart,
    });
    return;
  }

  const behavior: ScrollBehavior = immediate ? "instant" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior });
}

export function getScrollVelocity() {
  return scroll.lenis?.velocity ?? 0;
}
