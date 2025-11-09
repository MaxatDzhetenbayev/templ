"use client";
import React from "react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import {Header} from "@/shared/components/header";
import { useLocale, useTranslations } from "next-intl";

/* ========= Локализация ========= */
const LOCALES = ["ru", "kk", "en"] as const;
type Locale = (typeof LOCALES)[number];
const stripLeadingLocale = (path: string) => path.replace(/^\/(ru|kk|en)(?=\/|$)/, "");
const withLeadingSlash = (path: string) => (path.startsWith("/") ? path : `/${path}`);
function LocalizedLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
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

/* ========= Анимации ========= */
const container = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, ease: "easeOut", duration: 0.5 } },
};
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.45 } } };

/* ========= Карточка YouTube-видео ========= */
function YouTubeCard({
  href,
  title,
  channel,
  length,
  thumb,
  desc
}: {
  href: string;
  title: string;
  channel?: string;
  length?: string;
  thumb?: string;
  desc?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl border border-black/10 bg-white/70 shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
      aria-label={title}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/5">
        {thumb ? (
          <img
            src={thumb}
            alt="YouTube thumbnail"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full" />
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-md transition group-hover:scale-105 dark:bg-white/80">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7-11-7Z"/></svg>
          </span>
        </span>
        {length && (
          <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
            {length}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">{title}</div>
        {channel && <div className="mt-1 text-xs text-neutral-600 dark:text-white/60">{channel}</div>}
        {desc && <p className="mt-2 line-clamp-3 text-xs text-neutral-700 dark:text-white/60">{desc}</p>}
      </div>
    </a>
  );
}

/* ========= Заголовок секции ========= */
function SectionTitle({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto max-w-2xl text-center"
    >
      {eyebrow && (
        <motion.div
          variants={item}
          className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-white/60"
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h2 variants={item} className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
        {title}
      </motion.h2>
      {desc && <motion.p variants={item} className="mt-3 text-neutral-700 dark:text-white/70">{desc}</motion.p>}
    </motion.div>
  );
}

/* ========= Страница: Традиции (только видео) ========= */
export default function TraditionsPage() {
  const t = useTranslations("traditionsPage");

  // Ссылки, которые ты прислала (проблемную — пропускаем)
  const links = [
    "https://www.youtube.com/watch?v=fTS04CoySqE&list=PLrsl6dUjLkmG1kHWc_0KByLc5-X1VaIN3&index=1",
    "https://www.youtube.com/watch?v=wAxHaOOz-nE&list=PLrsl6dUjLkmG1kHWc_0KByLc5-X1VaIN3&index=30",
    "https://www.youtube.com/watch?v=DFbKFuLzREo&list=PLrsl6dUjLkmG1kHWc_0KByLc5-X1VaIN3&index=33",
    "https://www.youtube.com/watch?v=xN4Dd7zm-KE&list=PLrsl6dUjLkmG1kHWc_0KByLc5-X1VaIN3&index=37",
    "https://www.youtube.com/watch?v=NGvQ7usMWlo&list=PLrsl6dUjLkmG1kHWc_0KByLc5-X1VaIN3&index=52",
    "https://www.youtube.com/watch?v=vpnCvAdUn3E&list=PLrsl6dUjLkmG1kHWc_0KByLc5-X1VaIN3&index=34"
  ];

  const playlistItems = links.map((href, i) => {
    let id = "";
    try {
      id = new URL(href).searchParams.get("v") || "";
    } catch {}
    const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;

    return {
      href,
      thumb,
      title: t.optional?.(`videos.${i}.title`) ?? t.optional?.("fallbackTitle") ?? `Видео #${i + 1}`,
      channel: t.optional?.(`videos.${i}.channel`) ?? "YouTube Playlist",
      length: t.optional?.(`videos.${i}.length`) ?? undefined,
      desc: t.optional?.(`videos.${i}.desc`) ?? undefined
    };
  });

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 scroll-smooth dark:bg-neutral-950 dark:text-white">
      {/* Фоны — мягкие */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          className="absolute -top-28 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: `radial-gradient(50% 50% at 50% 50%, ${brand.primary} 0%, rgba(34,211,238,0) 70%)` }}
          initial={{ scale: 0.98, opacity: 0.16 }}
          animate={{ scale: 1.02, opacity: 0.24 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -bottom-28 left-1/4 h-[360px] w-[360px] rounded-full opacity-15 blur-3xl"
          style={{ background: `radial-gradient(50% 50% at 50% 50%, ${brand.secondary} 0%, rgba(147,197,253,0) 70%)` }}
          initial={{ scale: 0.98, opacity: 0.12 }}
          animate={{ scale: 1.03, opacity: 0.2 }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      <Header user={null} />

      {/* Хлебные крошки */}
      <nav className="mx-auto w-full max-w-6xl px-4 pt-6 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-neutral-600 dark:text-white/60">
          <li>
            <LocalizedLink href="/materials" className="underline-offset-2 hover:underline">
              {t("breadcrumbs.materials")}
            </LocalizedLink>
          </li>
          <li className="opacity-60">/</li>
          <li className="font-medium text-neutral-900 dark:text-white">{t("title")}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
            <motion.h1 variants={item} className="text-4xl md:text-5xl font-semibold leading-[1.1] dark:text-white">
              {t("title")}
            </motion.h1>
            <motion.p variants={item} className="text-neutral-700 dark:text-white/70">
              {t.optional?.("videosSection.desc")}
            </motion.p>
            <motion.div variants={item} className="flex gap-3 pt-2">
              <LocalizedLink
                href="/materials"
                className="rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm hover:bg-white/80 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {t("back")}
              </LocalizedLink>
            </motion.div>
          </motion.div>

          {/* Кнопка: открыть плейлист (локализовано, URL можно хранить в traditionsPage.playlistUrl) */}
          {t.optional?.("openPlaylist") && (
            <a
              href={(t.optional?.("playlistUrl") as string | undefined) ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-black/10 bg-white/70 p-6 text-sm backdrop-blur-xl shadow-xl transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
            >
              {t("openPlaylist")}
            </a>
          )}
        </div>
      </section>

      {/* Видео — карточки */}
      <section className="py-4 md:py-6">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow={t.optional?.("videosSection.eyebrow")}
            title={t.optional?.("videosSection.title") ?? t("title")}
            desc={undefined}
          />
          <motion.div variants={container} initial="hidden" animate="show" className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {playlistItems.length > 0 ? (
              playlistItems.map((v, idx) => (
                <motion.div key={idx} variants={item}>
                  <YouTubeCard
                    href={v.href}
                    title={v.title}
                    channel={v.channel}
                    length={v.length}
                    thumb={v.thumb}
                    desc={v.desc}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-black/10 bg-white/70 p-8 text-center text-neutral-600 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                {t.optional?.("videosSection.empty")}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-black/10 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg" style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})` }} />
            <span className="text-sm text-neutral-700 dark:text-white/70">© {new Date().getFullYear()} Kazakh Learn</span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-white/50">{t("footer.legal")}</div>
        </div>
      </footer>
    </div>
  );
}
