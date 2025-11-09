"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

import { Card, CardContent, CardHeader } from "@/shared/components/ui";

import { TESTIMONIALS } from "@/modules/landing/constants/landing.constants";

/**
 * Секция с отзывами
 */
export function TestimonialsSection() {
  const t = useTranslations("landing.testimonials");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-blue-500/5 to-pink-500/5 py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="container relative mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="group relative overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-2xl animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Градиентный фон */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 transition-opacity duration-500 group-hover:opacity-30`}
              />

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative size-14 overflow-hidden rounded-full ring-4 ring-background transition-transform group-hover:scale-110 group-hover:ring-primary/50">
                    <Image
                      src={testimonial.avatar}
                      alt={t(testimonial.nameKey)}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${testimonial.color} opacity-20`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">
                      {t(testimonial.nameKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(testimonial.roleKey)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-base leading-relaxed italic text-muted-foreground">
                  "{t(testimonial.textKey)}"
                </p>
                <div className="mt-4 flex text-yellow-500">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i} className="text-xl">
                      {star}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


