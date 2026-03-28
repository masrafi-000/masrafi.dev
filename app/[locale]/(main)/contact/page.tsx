import { getTranslations } from "next-intl/server";
import ContactClient from "./_components/ContactClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: `${t("pageTitle")} | Masrafi`,
    description: t("pageDescription"),
  };
}

export default async function ContactPage() {
  return <ContactClient />;
}
