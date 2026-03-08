"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "bn" : "en";
    startTransition(() => {
      router.replace({ pathname }, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className={cn(
        "flex items-center gap-2 p-2 rounded-full transition-colors duration-300 hover:text-blue-500 dark:hover:text-amber-400 disabled:opacity-50",
        className,
      )}
      aria-label="Toggle language"
    >
      <Languages className="h-5 w-5" />
      <span className="text-sm font-medium uppercase">
        {locale === "en" ? "bn" : "en"}
      </span>
    </button>
  );
};
