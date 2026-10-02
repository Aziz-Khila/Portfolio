import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { pick } from "@/content/types";
import { routing, type Locale } from "@/i18n/routing";
import { CaseStudy } from "@/components/case/CaseStudy";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const lang = (routing.locales as readonly string[]).includes(locale) ? (locale as Locale) : "en";
  const title = pick(project.title, lang);
  const description = pick(project.description, lang);

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/work/${slug}`,
      languages: { en: `/en/work/${slug}`, fr: `/fr/work/${slug}` },
    },
    openGraph: { title, description, images: [{ url: project.poster, width: 1280, height: 720 }] },
  };
}

export default async function CasePage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return <CaseStudy slug={slug} />;
}
