"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

import { Badge, Card, CardHeader, CardTitle } from "@/shared/components/ui";

import { MEDAL_IMAGES } from "@/modules/landing/constants/landing.constants";
import type { Rating } from "@/modules/landing/schemas/rating.schema";

export interface RatingsSectionProps {
  ratings: Rating[];
}

/**
 * Секция с рейтингом топ-5 пользователей
 */
export function RatingsSection({ ratings }: RatingsSectionProps) {
  const t = useTranslations("landing.ratings");

  const topRatings = ratings.slice(0, 5);

  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/30 py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.01]" />
      <div className="container relative mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {topRatings.map((rating, index) => (
            <Card
              key={rating.id}
              className="group relative overflow-hidden border transition-all hover:shadow-lg animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative size-16 overflow-hidden rounded-full bg-muted ring-2 ring-border">
                    <Image
                      src={MEDAL_IMAGES[index]}
                      alt={`Медаль ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      {rating.avatar && (
                        <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-primary/20 transition-all group-hover:ring-primary/40 group-hover:scale-110">
                          <Image
                            src={rating.avatar}
                            alt={rating.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-xl font-bold">
                          {rating.name}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="mt-1.5 font-semibold shadow-sm"
                        >
                          {rating.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">
                        {rating.score}
                      </span>
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("points")}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

