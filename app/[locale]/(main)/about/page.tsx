import { getTranslations } from "next-intl/server";
import AboutClient from "./_components/AboutClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    title: `${t("title")} | Masrafi`,
    description: t("subtitle"),
  };
}

export default async function AboutPage() {
  return <AboutClient />;
}
