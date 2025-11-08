"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui";

/**
 * Hero секция для лендинга
 */
export function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative overflow-hidden bg-background border-b border-border py-20 md:py-32">
      {/* Минималистичный паттерн */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl">
              {t("subtitle")}
            </p>
          </div>

          <div className="mb-12 flex animate-fade-in-up flex-col gap-4 sm:flex-row sm:justify-center [animation-delay:200ms]">
            <Button
              size="lg"
              className="text-lg font-medium"
            >
              {t("cta.primary")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg font-medium"
            >
              {t("cta.secondary")}
            </Button>
          </div>

          <div className="animate-fade-in-up [animation-delay:400ms]">
            <div className="mx-auto inline-flex flex-col items-center gap-2 rounded-lg border bg-card px-8 py-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.students")}
              </p>
              <p className="text-4xl font-bold text-foreground md:text-5xl">
                {t("stats.count")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

