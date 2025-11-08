"use client";

import { useTranslations } from "next-intl";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui";

import { COURSES } from "@/modules/landing/constants/landing.constants";

/**
 * Секция с курсами
 */
export function CoursesSection() {
  const t = useTranslations("landing.courses");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-purple-500/5 to-background py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="container relative mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((course, index) => (
            <Card
              key={course.id}
              className="group relative overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-2xl animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Яркий градиентный фон */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 transition-opacity duration-500 group-hover:opacity-20`}
              />
              
              {/* Декоративные элементы */}
              <div className={`absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${course.color} opacity-0 blur-2xl transition-opacity group-hover:opacity-30`} />

              <CardHeader className="relative z-10">
                <div className={`mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${course.color} text-4xl shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  {course.icon}
                </div>
                <CardTitle className="text-xl font-bold">
                  {t(course.titleKey)}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className={`mt-2 bg-gradient-to-r ${course.color} text-white border-0`}
                >
                  {t(course.duration)}
                </Badge>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="mb-4 text-base leading-relaxed">
                  {t(course.descriptionKey)}
                </CardDescription>
                <Button
                  className={`w-full bg-gradient-to-r ${course.color} text-white hover:shadow-lg transition-all`}
                  variant="default"
                >
                  {t("button")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

