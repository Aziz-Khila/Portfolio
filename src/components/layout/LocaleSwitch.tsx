"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitch({ className }: { className?: string }) {
  const t = useTranslations("a11y");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={clsx("label flex items-center gap-1", isPending && "opacity-50", className)}
    >
      {routing.locales.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true">/</span>}
          <button
            type="button"
            lang={code}
            aria-pressed={code === locale}
            onClick={() =>
              startTransition(() => router.replace(pathname, { locale: code, scroll: false }))
            }
            className={clsx(
              "px-1 py-2 uppercase transition-colors",
              code === locale ? "text-bone" : "text-mute hover:text-bone",
            )}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
