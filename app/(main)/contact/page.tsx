import { getTranslations } from "next-intl/server";
import ContactClient from "./_components/ContactClient";

export async function generateMetadata() {
  const t = await getTranslations("Contact");
  return {
    title: `${t("pageTitle")} | Masrafi`,
    description: t("pageDescription"),
  };
}

export default async function ContactPage() {
  return <ContactClient />;
}
