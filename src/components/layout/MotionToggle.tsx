"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { motionMode, useMotionMode } from "@/lib/motion";

export function MotionToggle({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const on = useMotionMode() === "full";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => motionMode.set(on ? "reduced" : "full")}
      className={clsx(
        "label flex items-center gap-2.5 py-2 transition-colors",
        on ? "text-bone" : "text-mute hover:text-bone",
        className,
      )}
    >
      {t("motion")}
      <span
        aria-hidden="true"
        className={clsx(
          "relative block h-4 w-7 rounded-full border transition-colors duration-300",
          on ? "border-accent bg-accent/15" : "border-line",
        )}
      >
        <span
          className={clsx(
            "absolute top-1/2 block size-2 -translate-y-1/2 rounded-full transition-[left,background-color] duration-300",
            on ? "left-[calc(100%-0.75rem)] bg-accent" : "left-[3px] bg-mute",
          )}
        />
      </span>
    </button>
  );
}
