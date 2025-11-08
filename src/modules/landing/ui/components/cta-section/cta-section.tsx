"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui";

/**
 * Секция призыва к действию
 */
export function CtaSection() {
  const t = useTranslations("landing.cta");

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="group relative overflow-hidden rounded-lg border bg-muted p-12 text-center shadow-sm md:p-16">
          {/* Минималистичный паттерн */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t("subtitle")}
            </p>
            <Button
              size="lg"
              className="text-lg font-medium"
            >
              {t("button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

