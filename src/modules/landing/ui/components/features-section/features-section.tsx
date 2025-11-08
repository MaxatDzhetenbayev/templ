"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui";

import { FEATURES } from "@/modules/landing/constants/landing.constants";

/**
 * Секция с преимуществами
 */
export function FeaturesSection() {
  const t = useTranslations("landing.features");

  return (
    <section className="relative border-b border-border bg-background py-20 md:py-32">
      <div className="container relative mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Card
              key={feature.id}
              className="group relative overflow-hidden border transition-all hover:shadow-lg animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardHeader className="relative z-10">
                <div className="relative mb-4 size-16 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={feature.imagePath}
                    alt={t(feature.titleKey)}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback если изображение не найдено
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <CardTitle className="text-xl font-semibold">
                  {t(feature.titleKey)}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-base leading-relaxed">
                  {t(feature.descriptionKey)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

