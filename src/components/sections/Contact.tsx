"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";

type Status = "idle" | "sending" | "success" | "error";

function Field({
  name,
  label,
  type = "text",
  multiline,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const className =
    "peer w-full resize-none border-b border-line bg-transparent pb-3 pt-7 text-xl text-bone outline-none transition-colors placeholder:text-transparent focus:border-accent";
  return (
    <label className="relative block">
      {multiline ? (
        <textarea name={name} required rows={4} placeholder={label} className={className} />
      ) : (
        <input name={name} type={type} required autoComplete={autoComplete} placeholder={label} className={className} />
      )}
      <span className="label pointer-events-none absolute left-0 top-0 transition-colors peer-focus:text-accent">
        {label}
      </span>
    </label>
  );
}

export function Contact() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const response = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const channels = [
    { label: t("email"), value: site.email, href: `mailto:${site.email}` },
    { label: t("phone"), value: site.phone, href: site.phoneHref },
    { label: t("social"), value: "LinkedIn", href: site.linkedin, external: true },
  ];

  return (
    <section id="contact" className="container-x relative py-[clamp(6rem,18vh,12rem)]">
      <SectionLabel index="06">{t("label")}</SectionLabel>
      <SplitReveal
        as="h2"
        type="words"
        className="display mt-10 max-w-[14ch] text-[clamp(3.25rem,9vw,10rem)]"
      >
        {t("title")}
      </SplitReveal>

      <div className="mt-[clamp(4rem,10vh,7rem)] grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="max-w-sm text-lg leading-relaxed text-bone/60">{t("text")}</p>
          <ul className="mt-12 border-t border-line">
            {channels.map((channel) => (
              <li key={channel.label} className="border-b border-line">
                <a
                  href={channel.href}
                  {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-baseline justify-between gap-6 py-6"
                >
                  <span className="label">{channel.label}</span>
                  <span className="flex items-center gap-3 text-[clamp(1.1rem,1.8vw,1.6rem)] font-medium tracking-[-0.02em] transition-colors group-hover:text-accent">
                    {channel.value}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="space-y-10 lg:col-span-6 lg:col-start-7">
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <input type="hidden" name="_subject" value="Portfolio contact — Mohamed Aziz Khila" />
          <input type="hidden" name="_template" value="table" />
          <div className="grid gap-10 md:grid-cols-2">
            <Field name="name" label={t("form.name")} autoComplete="name" />
            <Field name="email" type="email" label={t("form.email")} autoComplete="email" />
          </div>
          <Field name="message" label={t("form.message")} multiline />
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p role="status" aria-live="polite" className="max-w-xs text-sm text-bone/70">
              {status === "success" && t("form.success")}
              {status === "error" && t("form.error")}
            </p>
            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group relative overflow-hidden rounded-full bg-bone px-10 py-5 font-medium text-ink transition-colors disabled:opacity-60"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0" />
                <span className="relative">{status === "sending" ? t("form.sending") : t("form.submit")}</span>
              </button>
            </Magnetic>
          </div>
        </form>
      </div>
    </section>
  );
}
