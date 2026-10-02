import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/content/site";
import { motionInitScript } from "@/lib/motion-script";
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
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
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
      icon: [{ url: "/media/favicon-32.png", type: "image/png", sizes: "32x32" }],
      apple: "/media/apple-touch-icon.png",
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
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
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
