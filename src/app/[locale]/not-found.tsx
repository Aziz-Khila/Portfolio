"use client";

import { useTranslations } from "next-intl";
import { TransitionLink } from "@/components/ui/TransitionLink";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="container-x flex min-h-svh flex-col justify-end pb-[12vh] pt-[22vh]">
      <p className="label text-accent">404</p>
      <h1 className="display mt-6 max-w-[12ch] text-[clamp(2.5rem,11vw,12rem)] [overflow-wrap:anywhere]">
        {t("title")}
      </h1>
      <p className="mt-6 text-lg text-bone/60">{t("text")}</p>
      <TransitionLink
        href="/"
        className="mt-12 w-fit rounded-full bg-bone px-8 py-4 font-medium text-ink transition-colors hover:bg-accent"
      >
        {t("home")}
      </TransitionLink>
    </section>
  );
}
