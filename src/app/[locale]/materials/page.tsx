"use client";
import { Header } from "@/shared/components/header";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import React from "react";

/* ========= Локализация ========= */
const LOCALES = ["ru", "kk", "en"] as const;
type Locale = (typeof LOCALES)[number];
const stripLeadingLocale = (path: string) =>
  path.replace(/^\/(ru|kk|en)(?=\/|$)/, "");
const withLeadingSlash = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;
function LocalizedLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const locale = useLocale() as Locale;
  const clean = stripLeadingLocale(withLeadingSlash(href));
  const finalHref = `/${locale}${clean}`;
  return (
    <NextLink href={finalHref} className={className}>
      {children}
    </NextLink>
  );
}

/* ========= Бренд ========= */
const brand = { primary: "#38bdf8", secondary: "#22d3ee", accent: "#93c5fd" };

/* ========= Микро-анимации ========= */
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.5 } },
};

/* ========= Полностью кликабельная карточка ========= */
function CategoryLinkCard({
  title,
  desc,
  href,
  tag,
}: {
  title: string;
  desc?: string;
  href: string;
  tag?: string;
}) {
  return (
    <LocalizedLink
      href={href}
      aria-label={`${title}`}
      className="group relative block rounded-2xl border border-black/10 bg-white/70 p-5 shadow-lg outline-none backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:-translate-y-0.5 focus-visible:shadow-xl dark:border-white/10 dark:bg-white/5"
    >
      {/* Декор: тонкая подсветка по краю */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-sky-300/50 group-focus-visible:ring-sky-300/60"
      />

      {/* Иконка + заголовок */}
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-400/20 to-cyan-300/10 ring-1 ring-black/10 dark:ring-white/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 text-sky-700 dark:text-sky-300"
          >
            <path fill="currentColor" d="M8 5v14l11-7-11-7Z" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold text-neutral-900 dark:text-white">
            {title}
          </div>
          {desc && (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-700 dark:text-white/70">
              {desc}
            </p>
          )}
          {tag && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-md border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-xs text-sky-700 dark:text-sky-300">
              {tag}
            </span>
          )}
        </div>
      </div>

      {/* Ховер-указатель */}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5 w-5"
        >
          <path fill="currentColor" d="M10 6l6 6-6 6" />
        </svg>
      </span>
    </LocalizedLink>
  );
}

/* ========= Заголовок секции ========= */
function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto max-w-2xl text-center"
    >
      {eyebrow && (
        <div className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-white/60">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
        {title}
      </h2>
      {desc && (
        <p className="mt-3 text-neutral-700 dark:text-white/70">{desc}</p>
      )}
    </motion.div>
  );
}

/* ========= Страница Материалы ========= */
export default function MaterialsPage() {
  const t = useTranslations("materialsPage");

  const labels = {
    history: t("cats.history"),
    traditions: t("cats.traditions"),
    language: t("cats.language"),
    cuisine: t("cats.cuisine"),
    music: t("cats.music"),
    geography: t("cats.geography"),
  };

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 scroll-smooth dark:bg-neutral-950 dark:text-white">
      {/* Фоны — мягко и без "шумных" анимаций */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, ${brand.primary} 0%, rgba(34,211,238,0) 70%)`,
          }}
          initial={{ scale: 0.98, opacity: 0.18 }}
          animate={{ scale: 1.02, opacity: 0.28 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/4 h-[440px] w-[440px] rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, ${brand.secondary} 0%, rgba(147,197,253,0) 70%)`,
          }}
          initial={{ scale: 0.98, opacity: 0.14 }}
          animate={{ scale: 1.03, opacity: 0.22 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      <Header user={null} />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] dark:text-white">
              {t("hero.title")}
            </h1>
            <p className="text-neutral-700 dark:text-white/70">
              {t("hero.text")}
            </p>
            <div className="flex gap-3 pt-2">
              <LocalizedLink
                href="/"
                className="rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm hover:bg-white/80 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {t("hero.back")}
              </LocalizedLink>
            </div>
          </motion.div>

          <div className="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-white/5">
            <div className="text-sm text-neutral-600 dark:text-white/70">
              {t("filters.title")}
            </div>
            <p className="mt-2 text-xs text-neutral-600 dark:text-white/60">
              Выберите нужный раздел ниже — карточка полностью кликабельна.
            </p>
          </div>
        </div>
      </section>

      {/* Сетка разделов — только кликабельные карточки */}
      <section className="py-8 md:py-10">
        <SectionTitle
          eyebrow={t("grid.eyebrow")}
          title={t("hero.title")}
          desc={t("grid.desc")}
        />
        <div className="mx-auto mt-8 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 md:grid-cols-3">
          <CategoryLinkCard
            title={labels.history}
            tag={t("tags.history")}
            desc={t("history.0.desc")}
            href="/materials/history"
          />
          <CategoryLinkCard
            title={labels.traditions}
            tag={t("tags.traditions")}
            desc={t("traditions.0.desc")}
            href="/materials/traditions"
          />
          <CategoryLinkCard
            title={labels.language}
            tag={t("tags.language")}
            desc={t("language.0.desc")}
            href="/materials/language"
          />
          <CategoryLinkCard
            title={labels.cuisine}
            tag={t("tags.cuisine")}
            desc={t("cuisine.0.desc")}
            href="/materials/cuisine"
          />
          <CategoryLinkCard
            title={labels.music}
            tag={t("tags.music")}
            desc={t("music.0.desc")}
            href="/materials/music"
          />
        </div>
      </section>

      {/* Доп. подборки — оставим, но как лаконичные ссылки */}
      <section className="py-12 md:py-16">
        <SectionTitle
          eyebrow={t("collections.eyebrow")}
          title={t("collections.title")}
          desc={t("collections.desc")}
        />
        <div className="mx-auto mt-8 grid max-w-6xl gap-4 px-4 md:grid-cols-2">
          <LocalizedLink
            href="/materials/traditions"
            className="group rounded-2xl border border-black/10 bg-white/70 p-5 backdrop-blur-xl shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-600 dark:text-white/60">
                  {t("collections.playlist")}
                </div>
                <div className="text-lg font-medium dark:text-white">
                  {t("collections.playlistA.title")}
                </div>
              </div>
              <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs dark:border-white/15 dark:bg-white/10">
                8 {t("labels.items")}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-neutral-700 dark:text-white/70">
              {t("collections.playlistA.desc")}
            </p>
          </LocalizedLink>

          <LocalizedLink
            href="/materials/history"
            className="group rounded-2xl border border-black/10 bg-white/70 p-5 backdrop-blur-xl shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-600 dark:text-white/60">
                  {t("collections.playlist")}
                </div>
                <div className="text-lg font-medium dark:text-white">
                  {t("collections.playlistB.title")}
                </div>
              </div>
              <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs dark:border-white/15 dark:bg-white/10">
                6 {t("labels.items")}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-neutral-700 dark:text-white/70">
              {t("collections.playlistB.desc")}
            </p>
          </LocalizedLink>
        </div>
      </section>

      <footer className="border-t border-black/10 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})`,
              }}
            />
            <span className="text-sm text-neutral-700 dark:text-white/70">
              © {new Date().getFullYear()} Kazakh Learn
            </span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-white/50">
            {t("footer.legal")}
          </div>
        </div>
      </footer>
    </div>
  );
}
