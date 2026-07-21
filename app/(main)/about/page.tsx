import { getTranslations } from "next-intl/server";
import AboutClient from "./_components/AboutClient";

export async function generateMetadata() {
  const t = await getTranslations("About");
  return {
    title: `${t("title")} | Masrafi`,
    description: t("subtitle"),
  };
}

export default async function AboutPage() {
  return <AboutClient />;
}
