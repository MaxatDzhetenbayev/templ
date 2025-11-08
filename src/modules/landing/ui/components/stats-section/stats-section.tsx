"use client";

import { useTranslations } from "next-intl";

import { STATS } from "@/modules/landing/constants/landing.constants";

/**
 * Секция со статистикой
 */
export function StatsSection() {
  const t = useTranslations("landing.stats");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute -left-20 -top-20 size-96 animate-blob rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-20 -bottom-20 size-96 animate-blob rounded-full bg-white/10 blur-3xl [animation-delay:3s]" />
      
      <div className="container relative mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.id}
              className="group relative overflow-hidden rounded-2xl bg-white/10 p-8 text-center backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 hover:shadow-2xl animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Градиентный фон */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-500 group-hover:opacity-30`}
              />
              
              <div className="relative z-10">
                <div className={`mb-4 inline-flex size-20 items-center justify-center rounded-full bg-gradient-to-br ${stat.color} text-4xl shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  {stat.icon}
                </div>
                <div className={`mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl`}>
                  {t(stat.valueKey)}
                </div>
                <p className="text-sm font-medium text-white/90">
                  {t(stat.labelKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

