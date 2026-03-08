import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Hero");

  return (
    <div className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-background">
      {/* Background Subtle Gradient / Pattern */}
      <div className="absolute inset-0 z-0 bg-linear-to-br from-background via-background to-blue-50/20 dark:to-blue-900/10 pointer-events-none" />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Content Column */}
          <div className="flex flex-col gap-6 max-w-2xl">
            {/* Subtitle with accent line */}
            <div className="flex items-center gap-4">
              <div className="h-6 w-1 bg-blue-600 dark:bg-blue-500 rounded-full" />
              <span className="text-sm tracking-widest uppercase font-semibold text-muted-foreground">
                {t("subtitle")}
              </span>
            </div>

            {/* Main Elegant Heading */}
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.1] tracking-tight">
              {t("titleLine1")} <br />
              <span className="italic font-light text-blue-600 dark:text-blue-500">
                {t("titleLine2")}
              </span>{" "}
              <br />
              {t("titleLine3")}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4 max-w-xl font-light">
              {t("description")}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg hover:shadow-blue-600/25">
                {t("primaryButton")}
              </button>
              <button className="px-8 py-3.5 rounded-full bg-transparent border-2 border-border hover:border-foreground text-foreground font-medium transition-all">
                {t("secondaryButton")}
              </button>
            </div>
          </div>

          {/* Right Image Column (Placeholder matching aesthetic) */}
          <div className="relative h-full flex justify-center items-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-3/4 rounded-[2rem] overflow-hidden shadow-2xl bg-muted/30">
              {/* Stand-in for the professional cutout image requested in plan */}
              <div className="absolute inset-0 bg-linear-to-tr from-blue-100/40 to-transparent dark:from-blue-900/20" />
              <div className="absolute inset-x-0 bottom-0 top-20 flex justify-center items-end bg-border/20 rounded-t-full mx-8">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif italic text-2xl">
                  Cutout Portrait Here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
