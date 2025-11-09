"use client";
import { Header } from "@/shared/components/header";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import NextLink from "next/link";
import React from "react";

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

const brand = { primary: "#38bdf8", secondary: "#22d3ee", accent: "#93c5fd" };

const container = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, ease: "easeOut", duration: 0.5 },
  },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.45 } },
};

function YouTubeCard({
  href,
  title,
  channel,
  length,
  thumb,
  desc,
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
          <Image
            src={thumb}
            alt="YouTube thumbnail"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full" />
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-md transition group-hover:scale-105 dark:bg-white/80">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7-11-7Z" />
            </svg>
          </span>
        </span>
        {length && (
          <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
            {length}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
          {title}
        </div>
        {channel && (
          <div className="mt-1 text-xs text-neutral-600 dark:text-white/60">
            {channel}
          </div>
        )}
        {desc && (
          <p className="mt-2 line-clamp-3 text-xs text-neutral-700 dark:text-white/60">
            {desc}
          </p>
        )}
      </div>
    </a>
  );
}

function AudioCard({
  title,
  performer,
  length,
  cover,
  src,
  externalUrl,
  desc,
}: {
  title: string;
  performer?: string;
  length?: string;
  cover?: string;
  src?: string;
  externalUrl?: string;
  desc?: string;
}) {
  const content = (
    <div className="flex gap-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-neutral-100 dark:bg-white/10 grid place-items-center">
        {cover ? (
          <Image src={cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            className="opacity-70"
          >
            <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z" />
          </svg>
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-neutral-900 dark:text-white">
          {title}
        </div>
        {performer && (
          <div className="text-xs text-neutral-600 dark:text-white/60">
            {performer}
          </div>
        )}
        {desc && (
          <div className="mt-1 line-clamp-2 text-xs text-neutral-700 dark:text-white/60">
            {desc}
          </div>
        )}
        {length && (
          <div className="mt-1 text-[11px] text-neutral-500 dark:text-white/50">
            {length}
          </div>
        )}
        {src ? (
          <audio controls preload="none" className="mt-2 w-full">
            <source src={src} />
            {/* Можно добавить <source src="..." type="audio/ogg" /> */}
          </audio>
        ) : externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-md border border-black/10 bg-white/60 px-3 py-1.5 text-xs hover:bg-white/80 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15"
          >
            Открыть аудио
          </a>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="group rounded-2xl border border-black/10 bg-white/70 p-4 shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
      {content}
    </div>
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
      <motion.h2
        variants={item}
        className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white"
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          variants={item}
          className="mt-3 text-neutral-700 dark:text-white/70"
        >
          {desc}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ========= Страница: Музыка =========
   Локали ожидаются:
   musicPage.videos.N.{url|id,title,channel,length,desc}
   musicPage.audios.N.{src|externalUrl,title,performer,length,cover,desc}
   musicPage.openPlaylist, musicPage.playlistUrl — опционально
*/
export default function MusicPage() {
  const t = useTranslations("musicPage");

  // ВИДЕО из переводов
  const videos = Array.from({ length: 12 }).flatMap((_, i) => {
    const url = t.optional?.(`videos.${i}.url`) as string | undefined;
    const id =
      (t.optional?.(`videos.${i}.id`) as string | undefined) ??
      (url ? new URL(url).searchParams.get("v") ?? undefined : undefined);
    if (!url && !id) return [];
    const href = url ?? `https://www.youtube.com/watch?v=${id}`;
    const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
    return [
      {
        href,
        thumb,
        title:
          (t.optional?.(`videos.${i}.title`) as string | undefined) ??
          (t.optional?.("fallbackTitle") as string | undefined) ??
          "",
        channel: t.optional?.(`videos.${i}.channel`) as string | undefined,
        length: t.optional?.(`videos.${i}.length`) as string | undefined,
        desc: t.optional?.(`videos.${i}.desc`) as string | undefined,
      },
    ];
  });

  // АУДИО кюи из переводов
  const audios = Array.from({ length: 24 }).flatMap((_, i) => {
    const src = t.optional?.(`audios.${i}.src`) as string | undefined; // прямой mp3/ogg
    const externalUrl = t.optional?.(`audios.${i}.externalUrl`) as
      | string
      | undefined; // если нет прямого файла
    if (!src && !externalUrl) return [];
    return [
      {
        src,
        externalUrl,
        title:
          (t.optional?.(`audios.${i}.title`) as string | undefined) ??
          (t.optional?.("fallbackAudioTitle") as string | undefined) ??
          "Kui",
        performer: t.optional?.(`audios.${i}.performer`) as string | undefined,
        length: t.optional?.(`audios.${i}.length`) as string | undefined,
        cover: t.optional?.(`audios.${i}.cover`) as string | undefined,
        desc: t.optional?.(`audios.${i}.desc`) as string | undefined,
      },
    ];
  });

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 scroll-smooth dark:bg-neutral-950 dark:text-white">
      {/* Фоны */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          className="absolute -top-28 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, ${brand.primary} 0%, rgba(34,211,238,0) 70%)`,
          }}
          initial={{ scale: 0.98, opacity: 0.16 }}
          animate={{ scale: 1.02, opacity: 0.24 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -bottom-28 left-1/4 h-[360px] w-[360px] rounded-full opacity-15 blur-3xl"
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, ${brand.secondary} 0%, rgba(147,197,253,0) 70%)`,
          }}
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
            <LocalizedLink
              href="/materials"
              className="underline-offset-2 hover:underline"
            >
              {t("breadcrumbs.materials")}
            </LocalizedLink>
          </li>
          <li className="opacity-60">/</li>
          <li className="font-medium text-neutral-900 dark:text-white">
            {t("title")}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            <motion.h1
              variants={item}
              className="text-4xl md:text-5xl font-semibold leading-[1.1] dark:text-white"
            >
              {t("title")}
            </motion.h1>
            <motion.p
              variants={item}
              className="text-neutral-700 dark:text-white/70"
            >
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

          {/* Кнопка: плейлист (если указан) */}
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

      {/* Видео */}
      <section className="py-4 md:py-6">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow={t.optional?.("videosSection.eyebrow")}
            title={t.optional?.("videosSection.title") ?? t("title")}
            desc={undefined}
          />
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3"
          >
            {videos.length > 0 ? (
              videos.map((v, idx) => (
                <motion.div key={idx} variants={item}>
                  <YouTubeCard
                    href={v.href}
                    title={
                      v.title ||
                      (t.optional?.("fallbackTitle") as string) ||
                      "Video"
                    }
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

      {/* Аудио кюи */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow={t.optional?.("audiosSection.eyebrow")}
            title={t.optional?.("audiosSection.title") ?? "Kuy — аудио"}
            desc={t.optional?.("audiosSection.desc") ?? undefined}
          />
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3"
          >
            {audios.length > 0 ? (
              audios.map((a, idx) => (
                <motion.div key={idx} variants={item}>
                  <AudioCard
                    title={a.title}
                    performer={a.performer}
                    length={a.length}
                    cover={a.cover}
                    src={a.src}
                    externalUrl={a.externalUrl}
                    desc={a.desc}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-black/10 bg-white/70 p-8 text-center text-neutral-600 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                {t.optional?.("audiosSection.empty") ?? "Аудио появится позже"}
              </div>
            )}
          </motion.div>
          {t.optional?.("audiosSection.note") && (
            <p className="mt-4 text-center text-xs text-neutral-500 dark:text-white/50">
              {t("audiosSection.note")}
            </p>
          )}
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
