import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/content/site";
import { motionInitScript } from "@/lib/motion-script";
import { themeInitScript } from "@/lib/theme-script";
import { DocumentPrefs } from "@/components/providers/DocumentPrefs";
import { MotionBoundary } from "@/components/providers/MotionBoundary";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageTransition } from "@/components/providers/PageTransition";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/layout/Cursor";
import "../globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f2ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  colorScheme: "dark light",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "en" | "fr", namespace: "meta" });

  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: `%s — ${site.name}` },
    description: t("description"),
    authors: [{ name: site.name }],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", fr: "/fr", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t("title"),
      description: t("description"),
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
    icons: {
      icon: [
        { url: "/media/khila-icon.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
        { url: "/media/khila-icon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
        { url: "/media/favicon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/media/favicon-48.png", type: "image/png", sizes: "48x48" },
      ],
      apple: [{ url: "/media/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "a11y" });

  return (
    <html
      lang={locale}
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${bebasNeue.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Script id="motion-init" strategy="beforeInteractive">
          {motionInitScript}
        </Script>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <NextIntlClientProvider>
          <DocumentPrefs />
          <MotionBoundary>
            <SmoothScroll>
              <PageTransition>
                <a
                  href="#main"
                  className="label fixed left-4 top-4 z-[99] -translate-y-24 rounded-full bg-bone px-4 py-2 text-ink focus:translate-y-0"
                >
                  {t("skip")}
                </a>
                <Preloader />
                <Header />
                <main id="main" className="relative z-10 bg-ink">
                  {children}
                </main>
                <Footer />
                <Cursor />
                <div className="grain" aria-hidden="true" />
              </PageTransition>
            </SmoothScroll>
          </MotionBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
