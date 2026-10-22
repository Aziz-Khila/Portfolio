"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { themeMode, useThemeMode } from "@/lib/theme";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="2.4" fill="currentColor" />
      <path
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        d="M8 1.35v1.45M8 13.2v1.45M1.35 8h1.45M13.2 8h1.45M3.25 3.25l1.05 1.05M11.7 11.7l1.05 1.05M12.75 3.25l-1.05 1.05M4.3 11.7l-1.05 1.05"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M10.75 2.1a6 6 0 1 0 3.15 10.7A6.6 6.6 0 1 1 10.75 2.1Z"
      />
    </svg>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const theme = useThemeMode();
  const light = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={light ? t("themeLight") : t("themeDark")}
      title={light ? t("themeLight") : t("themeDark")}
      onClick={() => themeMode.toggle()}
      className={clsx(
        "label flex items-center gap-2.5 py-2 transition-colors",
        "text-bone",
        className,
      )}
    >
      {t("theme")}
      <span
        aria-hidden="true"
        className={clsx(
          "relative block h-4 w-7 rounded-full border transition-colors duration-300",
          "border-accent bg-accent/15",
        )}
      >
        <span
          className={clsx(
            "absolute top-1/2 flex size-2.5 -translate-y-1/2 items-center justify-center text-accent transition-[left] duration-300",
            light ? "left-[3px]" : "left-[calc(100%-0.85rem)]",
          )}
        >
          {light ? <SunIcon className="size-2.5" /> : <MoonIcon className="size-2.5" />}
        </span>
      </span>
    </button>
  );
}
